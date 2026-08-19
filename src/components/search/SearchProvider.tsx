'use client';

import {
  createContext,
  useCallback,
  useContext,
  useDeferredValue,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { findBestMatch, type ToolSearchEntry } from '@/lib/search';

/**
 * One search query, shared by three components that are not near each other in
 * the tree: the hero field, the navbar field, and the results grid.
 *
 * WHY A CONTEXT IN THE ROOT LAYOUT, AND NOT A `?q=` SEARCH PARAM:
 *
 * The obvious implementation is to push the query into the URL and read it back
 * with `useSearchParams`. That would have cost the whole site its static
 * prerendering — `useSearchParams` in a prerendered route forces the page into
 * dynamic rendering unless every consumer is wrapped in Suspense, and it makes
 * each keystroke a router transition. Both are the opposite of what this build
 * is for.
 *
 * State in the root layout is the better fit, and for a non-obvious reason:
 * layouts do not remount across client-side navigation in the App Router. So
 * when the navbar field carries a query from an article page back to the
 * homepage, the state survives the navigation for free — no serialisation, no
 * param, no effect to re-read it on the other side. It also means the navbar
 * input element itself is never unmounted, so the caret stays where it was and
 * the user can keep typing straight through the route change.
 *
 * The tradeoff, stated plainly: a search is not linkable or restorable on
 * reload. For a client-side filter over a list that is already fully present in
 * the HTML, that is the right trade — but it would be the wrong one if these
 * results were ever paginated or server-fetched.
 */
interface SearchContextValue {
  /** Tracks the input on every keystroke. Bind fields to this. */
  query: string;
  setQuery: (value: string) => void;
  /**
   * Lags `query` by a frame under load. Filter the grid with this, never with
   * `query` — that split is what keeps typing responsive on 77 records without
   * a debounce timer, which would make the field feel laggy instead.
   */
  deferredQuery: string;
  /** True while the grid is a frame behind, for a subtle staleness cue. */
  isStale: boolean;
  /**
   * Published by the results grid via an effect, read by the hero so it can
   * show a live count.
   *
   * This is deliberately a callback rather than the hero computing its own
   * count: the hero would need the full tool array to do that, which would
   * duplicate ~30KB of RSC payload on the one page where every byte above the
   * fold matters most. Null whenever no grid is mounted.
   */
  resultCount: number | null;
  setResultCount: (value: number | null) => void;
  /**
   * Resolves the current query to a tool page, or null when nothing matches
   * closely enough.
   *
   * Lives here rather than in the grid because Enter has to work from the
   * navbar on article pages, where no grid is mounted. Handing every field the
   * same resolver also means the hero and the navbar can never disagree about
   * where a given query leads.
   */
  resolve: (rawQuery: string) => ToolSearchEntry | null;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function useSearch(): SearchContextValue {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be called inside <SearchProvider>.');
  }
  return context;
}

export default function SearchProvider({
  children,
  toolIndex,
}: {
  children: ReactNode;
  /**
   * Name→URL lookup for Enter-to-navigate, built server-side in the root
   * layout. See `getToolSearchIndex` for why this shape is as narrow as it is.
   */
  toolIndex: ToolSearchEntry[];
}) {
  const [query, setQuery] = useState('');
  const [resultCount, setResultCount] = useState<number | null>(null);
  const deferredQuery = useDeferredValue(query);

  const resolve = useCallback(
    (rawQuery: string) => findBestMatch(toolIndex, rawQuery),
    [toolIndex],
  );

  /**
   * Memoised so the context value is referentially stable between renders that
   * did not change the query. Without this every consumer re-renders on any
   * parent render, which on a provider this high in the tree would be constant.
   */
  const value = useMemo<SearchContextValue>(
    () => ({
      query,
      setQuery,
      deferredQuery,
      isStale: query !== deferredQuery,
      resultCount,
      setResultCount,
      resolve,
    }),
    [query, deferredQuery, resultCount, resolve],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}
