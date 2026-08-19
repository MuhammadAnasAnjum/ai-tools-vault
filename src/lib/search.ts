/**
 * Shared matching logic for "type a tool name, press Enter, land on it".
 *
 * Deliberately NOT `server-only`: this module is imported by both the server
 * (to build the index at build time) and the client (to resolve a keystroke
 * into a destination). It is pure — no filesystem, no fetch, no React.
 *
 * The index it works over is intentionally tiny. Enter-to-navigate has to work
 * from the navbar on pages where the results grid is not mounted — an article
 * page has no tool array in scope — so the lookup table travels in the root
 * layout's payload instead. That is why the entry shape is three short strings
 * and not `ToolCardData`: at 77 tools the full card shape would be ~30KB of RSC
 * payload on every route, where this is under 5KB before compression and
 * compresses to roughly a tenth of that, since the repeated keys collapse.
 */

/** The minimum a search result needs: what to match, and where to send them. */
export interface ToolSearchEntry {
  name: string;
  slug: string;
  category: string;
}

/**
 * Folds a string to a comparable form: lowercase, punctuation flattened to
 * spaces, runs collapsed.
 *
 * Punctuation has to go rather than be stripped outright, because the two are
 * not the same for these names. Stripping turns "Copy.ai" into "copyai", which
 * then fails to match the perfectly reasonable query "copy ai"; flattening to a
 * space gives "copy ai" on both sides. Diacritics are folded through NFD so
 * "Jenni" and "Jénni" agree.
 */
export function normalise(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * The same fold with the separators taken out entirely: "Notion AI" \u2192 "notionai".
 *
 * This exists because `normalise` alone cannot serve both halves of one real
 * habit. People run names together when they type fast \u2014 "notionai", "copyai",
 * "githubcopilot" \u2014 and under a space-preserving fold those queries match
 * nothing at all, since "notionai" is not a substring of "notion ai". Comparing
 * the space-free forms catches them.
 *
 * It is a separate function rather than a change to `normalise` on purpose:
 * collapsing to spaces is what makes "copy ai" find "Copy.ai", so both folds are
 * needed and the compact one is scored strictly lower (see `score`).
 */
function compact(value: string): string {
  return normalise(value).replace(/ /g, '');
}

/**
 * How well one entry answers one query. Higher is better; 0 means "no match".
 *
 * The tiers matter more than the exact numbers. An exact name beats a prefix,
 * a prefix beats a word-start, and a word-start beats a loose substring — so
 * typing "chat" reaches ChatGPT rather than whichever tool merely mentions chat
 * in its slug, and typing "gpt" still reaches ChatGPT through the word-start
 * tier. A bare substring scores lowest because it is the tier most likely to be
 * a coincidence.
 */
function score(entry: ToolSearchEntry, query: string): number {
  const name = normalise(entry.name);
  const slug = normalise(entry.slug);

  if (name === query || slug === query) return 100;
  if (name.startsWith(query)) return 80;
  if (slug.startsWith(query)) return 70;

  // Word-start inside the name: "copilot" should reach "GitHub Copilot".
  if (name.split(' ').some((word) => word.startsWith(query))) return 60;
  if (slug.split(' ').some((word) => word.startsWith(query))) return 50;

  if (name.includes(query)) return 30;
  if (slug.includes(query)) return 20;

  /**
   * Last resort: compare with separators removed, so "notionai" reaches
   * "Notion AI". Scored beneath every space-aware tier — and reached only after
   * they have all returned nothing — so it can rescue a query that would
   * otherwise resolve to null, but can never outrank a match that respects word
   * boundaries. An exact hit here is still worth more than a loose prefix,
   * because running the words together is a typing habit, not an ambiguity.
   */
  const compactQuery = query.replace(/ /g, '');
  if (compactQuery.length >= 2) {
    const compactName = compact(entry.name);
    const compactSlug = compact(entry.slug);

    if (compactName === compactQuery || compactSlug === compactQuery) return 15;
    if (compactName.startsWith(compactQuery)) return 10;
    if (compactSlug.startsWith(compactQuery)) return 5;
  }

  return 0;
}

/**
 * The single best destination for a query, or null if nothing is close enough.
 *
 * Returning null is a real answer, not a failure: it is what lets the caller
 * fall back to the filtered grid instead of teleporting the reader onto a page
 * that has little to do with what they typed. Guessing wrong here is worse than
 * not guessing, because the reader loses their query and their place at once.
 *
 * Single-character queries are refused outright — at one character the top
 * match is effectively arbitrary among 77 tools.
 */
export function findBestMatch(
  entries: readonly ToolSearchEntry[],
  rawQuery: string,
): ToolSearchEntry | null {
  const query = normalise(rawQuery);
  if (query.length < 2) return null;

  let best: ToolSearchEntry | null = null;
  let bestScore = 0;

  for (const entry of entries) {
    const value = score(entry, query);
    if (value === 0) continue;

    if (
      value > bestScore ||
      // Same tier: prefer the shorter name. Between "Notion AI" and "Notion AI
      // Projects" for the query "notion ai", the shorter one is the one the
      // reader named exactly.
      (value === bestScore && best !== null && entry.name.length < best.name.length)
    ) {
      best = entry;
      bestScore = value;
    }
  }

  return best;
}
