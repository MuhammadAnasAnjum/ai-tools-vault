/**
 * Shapes for content/tools.json and the per-article frontmatter.
 *
 * IMPORTANT: `editorialNote` in tools.json is an INTERNAL research/QA note. It is
 * deliberately absent from every public-facing type below so it cannot reach the
 * DOM by accident. Read it only in build-time tooling, never in a component.
 */

export type ToolStatus =
  | 'sunset'
  | 'product-discontinued'
  | 'maintenance'
  | 'uncertain-status';

export type PageType = 'decision-guide';

/** A category as declared in the tools.json `categories` array. */
export interface CategoryMeta {
  slug: string;
  name: string;
  label: string;
  indexFile: string;
  toolCount: number;
}

/** A tool entry from tools.json, minus internal-only fields. */
export interface ToolEntry {
  slug: string;
  name: string;
  vendor: string;
  category: string;
  functionalCategory: string;
  file: string;
  website: string;
  positioning: string;
  freeTier: boolean;
  startingPrice: string;
  bestFor: string[];
  lastVerified: string;
  status?: ToolStatus;
  pageType?: PageType;
  relatedTool?: string;
}

/** Frontmatter parsed from an article markdown file. */
export interface ArticleFrontmatter {
  slug: string;
  name: string;
  vendor: string;
  category: string;
  functionalCategory: string;
  website: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  lastVerified: string;
  freeTier: boolean;
  startingPrice: string;
}

/** A question/answer pair lifted out of the article's FAQs section. */
export interface Faq {
  question: string;
  answer: string;
}

/**
 * The subset of a tool that the client-side grid actually renders.
 *
 * `ToolEntry` is a server-side shape and carries fields the browser has no use
 * for — notably `file`, an internal repo path like `content/chatbots/foo.md`.
 * Anything passed as a prop to a Client Component is serialised into the RSC
 * payload and shipped to every visitor, so the explorer receives this narrower
 * type instead: it keeps ~8KB of dead weight and our directory layout out of
 * the page source.
 */
export interface ToolCardData {
  slug: string;
  name: string;
  vendor: string;
  category: string;
  functionalCategory: string;
  positioning: string;
  freeTier: boolean;
  startingPrice: string;
  bestFor: string[];
  status?: ToolStatus;
}

/** A fully resolved tool page: manifest entry + frontmatter + rendered body. */
export interface ToolPage {
  entry: ToolEntry;
  frontmatter: ArticleFrontmatter;
  /** Body HTML with the leading H1 removed so each page has exactly one H1. */
  html: string;
  faqs: Faq[];
  /**
   * The article's closing verification note, lifted out of the body so it can
   * be rendered as a citation block rather than as trailing prose. Null when an
   * article has none.
   */
  verificationNote: string | null;
  readingMinutes: number;
}

/** A category index page: its own frontmatter + rendered intro + member tools. */
export interface CategoryPage {
  meta: CategoryMeta;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lastVerified: string;
  html: string;
  /**
   * Projected to `ToolCardData` rather than `ToolEntry` because these are handed
   * straight to `<ToolCard>`, a Client Component. See the note on ToolCardData.
   */
  tools: ToolCardData[];
}
