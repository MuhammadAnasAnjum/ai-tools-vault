'use client';

import { useRouter } from 'next/navigation';
import { useId, useRef } from 'react';

import { useSearch } from './SearchProvider';
import { routes } from '@/lib/site';

/**
 * The search input. One component, two sizes — `hero` and `compact` (navbar).
 *
 * Both write to the same context, so typing in either one filters the grid
 * immediately with no navigation and no refetch: the full tool list is already
 * in the document, and filtering only hides rows that were already delivered.
 *
 * THE NAVBAR CASE: the grid only exists on the homepage. Typing into the navbar
 * field from an article page would otherwise update state that nothing is
 * rendering, so `navigateHome` routes there on the first keystroke that produces
 * a non-empty query. `router.push` is a client-side transition — the layout
 * (and therefore the provider, and this very input) is preserved, so the caret
 * does not move and the query survives. `scroll: false` stops the browser
 * jumping to the top mid-keystroke; the hash target handles positioning instead.
 *
 * ENTER OPENS THE MATCHING TOOL. Filtering as you type is the common case, but a
 * reader who already knows the name of the tool they want should not have to
 * type it and then go hunting through the grid for the card. The field is a real
 * <form>, so Enter fires `submit` — which also picks up the mobile keyboard's
 * "go" key for free, where a bare keydown handler on the input would not.
 */
export default function SearchField({
  variant = 'hero',
  navigateHome = false,
  autoFocusTarget = false,
}: {
  variant?: 'hero' | 'compact';
  /** Set on the navbar instance: sends the user to the results on first input. */
  navigateHome?: boolean;
  /** Adds the scroll anchor id so the hero CTA can jump focus here. */
  autoFocusTarget?: boolean;
}) {
  const { query, setQuery, resultCount, resolve } = useSearch();
  const router = useRouter();
  const inputId = useId();
  const hintId = useId();
  const hasNavigated = useRef(false);

  const isHero = variant === 'hero';

  function handleChange(value: string) {
    setQuery(value);

    if (navigateHome && value.trim() && !hasNavigated.current) {
      hasNavigated.current = true;
      router.push(`${routes.home()}#explore`, { scroll: false });
    }

    // Reset the latch when the field is cleared, so a second search from
    // another page navigates again rather than silently filtering nothing.
    if (!value.trim()) {
      hasNavigated.current = false;
    }
  }

  /**
   * Enter goes to the best-matching tool page.
   *
   * When nothing matches confidently the query is left alone and the reader
   * stays on the filtered grid: a wrong guess costs them their place AND their
   * query, which is worse than doing nothing. From an article page, where there
   * is no grid to fall back to, we at least land them on the results section.
   */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const target = resolve(query);

    if (target) {
      hasNavigated.current = false;
      router.push(routes.tool(target.category, target.slug));
      return;
    }

    if (navigateHome && query.trim()) {
      router.push(`${routes.home()}#explore`, { scroll: false });
    }
  }

  // Named so the hint can promise the destination before the reader commits.
  const match = query.trim() ? resolve(query) : null;

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={isHero ? 'w-full max-w-2xl' : 'w-full'}
    >
      <label htmlFor={inputId} className="sr-only">
        Search AI tools
      </label>

      {/**
       * THIS WRAPPER IS WHY THE ICON SITS CENTRED. It holds the input and the
       * icon and nothing else, so `inset-y-0` resolves against the input's own
       * height. The hint paragraph below used to live inside this box, which
       * made the icon centre itself against input + hint together and sit
       * visibly low and detached from the placeholder. Anything added here later
       * must be absolutely positioned, or it brings the bug back.
       */}
      <div className="relative flex items-center">
        {/* Full-height flex box rather than `top-1/2 -translate-y-1/2`: the icon
            then tracks the field's real height at every breakpoint instead of
            relying on a transform that assumes it. */}
        <span
          className={`pointer-events-none absolute inset-y-0 left-0 flex items-center text-muted ${
            isHero ? 'pl-5' : 'pl-3.5'
          }`}
          aria-hidden="true"
        >
          <svg
            className={isHero ? 'h-5 w-5' : 'h-4 w-4'}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
        </span>

        <input
          id={inputId}
          {...(autoFocusTarget ? { 'data-search-anchor': 'true' } : {})}
          type="search"
          value={query}
          onChange={(event) => handleChange(event.target.value)}
          // "go" rather than "search": Enter navigates to a page here, and the
          // mobile key label should say what the key will actually do.
          enterKeyHint="go"
          autoComplete="off"
          aria-describedby={isHero ? hintId : undefined}
          placeholder={
            isHero ? 'Search 77 tools — try “video editing”, “free”, or “Claude”' : 'Search tools'
          }
          className={
            isHero
              ? 'w-full rounded-lg border border-line-field bg-field py-4 pl-14 pr-4 text-base text-strong shadow-field transition-colors placeholder:text-muted hover:border-brand-500 focus:border-brand-500 focus:outline-none focus:ring-0'
              : 'w-full rounded-lg border border-line-field bg-fill py-2 pl-10 pr-3 text-sm text-strong transition-colors placeholder:text-muted hover:border-brand-500 focus:border-brand-500 focus:outline-none focus:ring-0'
          }
        />
      </div>

      {isHero ? (
        <p id={hintId} className="mt-3 text-sm text-muted">
          {match
            ? `Press Enter to open ${match.name}`
            : query.trim() && resultCount !== null
              ? `${resultCount} ${resultCount === 1 ? 'tool matches' : 'tools match'} — results update as you type`
              : 'Filters as you type. Press Enter to open a tool by name.'}
        </p>
      ) : null}
    </form>
  );
}
