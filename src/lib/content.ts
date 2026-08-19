import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import matter from 'gray-matter';

import {
  extractFaqs,
  readingMinutes,
  renderMarkdown,
  splitVerificationFooter,
  stripLeadingH1,
} from './markdown';
import type { ToolSearchEntry } from './search';
import type {
  ArticleFrontmatter,
  CategoryMeta,
  CategoryPage,
  ToolCardData,
  ToolEntry,
  ToolPage,
} from './types';

/**
 * Content lives outside src/ so editors can work on markdown without touching
 * app code. Everything here runs at build time on the server; `server-only`
 * makes it a compile error to import this module into a client component.
 */
const CONTENT_ROOT = path.join(process.cwd(), 'content');
const MANIFEST_PATH = path.join(CONTENT_ROOT, 'tools.json');

interface RawManifest {
  categories: CategoryMeta[];
  tools: Array<ToolEntry & { editorialNote?: string }>;
}

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw) as T;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

/**
 * Loads the manifest and strips internal-only fields.
 *
 * `editorialNote` is destructured off deliberately: it holds raw research notes
 * (competitor claims, unverified figures, drop rationales) that must never be
 * serialised into a payload sent to the browser.
 */
export const getManifest = cache(
  async (): Promise<{ categories: CategoryMeta[]; tools: ToolEntry[] }> => {
    const raw = await readJson<RawManifest>(MANIFEST_PATH);

    const tools: ToolEntry[] = raw.tools.map((tool) => {
      const { editorialNote: _internal, ...publicFields } = tool;
      return { ...publicFields, bestFor: toStringArray(publicFields.bestFor) };
    });

    return { categories: raw.categories, tools };
  },
);

export const getCategories = cache(async (): Promise<CategoryMeta[]> => {
  const { categories } = await getManifest();
  return categories;
});

export const getAllTools = cache(async (): Promise<ToolEntry[]> => {
  const { tools } = await getManifest();
  return tools;
});

export const getToolsByCategory = cache(
  async (categorySlug: string): Promise<ToolEntry[]> => {
    const tools = await getAllTools();
    return tools.filter((tool) => tool.category === categorySlug);
  },
);

export const getCategoryMeta = cache(
  async (categorySlug: string): Promise<CategoryMeta | null> => {
    const categories = await getCategories();
    return categories.find((category) => category.slug === categorySlug) ?? null;
  },
);

function coerceFrontmatter(data: Record<string, unknown>): ArticleFrontmatter {
  return {
    slug: String(data.slug ?? ''),
    name: String(data.name ?? ''),
    vendor: String(data.vendor ?? ''),
    category: String(data.category ?? ''),
    functionalCategory: String(data.functionalCategory ?? ''),
    website: String(data.website ?? ''),
    metaTitle: String(data.metaTitle ?? ''),
    metaDescription: String(data.metaDescription ?? ''),
    h1: String(data.h1 ?? ''),
    primaryKeyword: String(data.primaryKeyword ?? ''),
    secondaryKeywords: toStringArray(data.secondaryKeywords),
    lastVerified: String(data.lastVerified ?? ''),
    freeTier: Boolean(data.freeTier),
    startingPrice: String(data.startingPrice ?? ''),
  };
}

/**
 * Resolves one tool page. Returns null when the slug/category pair doesn't
 * exist or its markdown file is missing, so routes can call notFound().
 */
export const getToolPage = cache(
  async (categorySlug: string, toolSlug: string): Promise<ToolPage | null> => {
    const tools = await getAllTools();
    const entry = tools.find(
      (tool) => tool.slug === toolSlug && tool.category === categorySlug,
    );
    if (!entry) return null;

    const filePath = path.join(process.cwd(), entry.file);

    let raw: string;
    try {
      raw = await fs.readFile(filePath, 'utf8');
    } catch {
      return null;
    }

    const { data, content } = matter(raw);
    const frontmatter = coerceFrontmatter(data as Record<string, unknown>);

    const faqs = extractFaqs(content);
    const { body, footer } = splitVerificationFooter(content);
    // The visible <h1> comes from frontmatter, so remove the body's duplicate.
    const html = await renderMarkdown(stripLeadingH1(body));

    return {
      entry,
      frontmatter,
      html,
      faqs,
      verificationNote: footer,
      readingMinutes: readingMinutes(content),
    };
  },
);

/** Resolves a category index page from its `_index.md`. */
export const getCategoryPage = cache(
  async (categorySlug: string): Promise<CategoryPage | null> => {
    const meta = await getCategoryMeta(categorySlug);
    if (!meta) return null;

    const filePath = path.join(process.cwd(), meta.indexFile);

    let raw: string;
    try {
      raw = await fs.readFile(filePath, 'utf8');
    } catch {
      return null;
    }

    const { data, content } = matter(raw);
    const fm = data as Record<string, unknown>;
    const html = await renderMarkdown(stripLeadingH1(content));
    const tools = await getToolsByCategory(categorySlug);

    return {
      meta,
      title: String(fm.title ?? meta.label),
      metaTitle: String(fm.metaTitle ?? meta.label),
      metaDescription: String(fm.metaDescription ?? ''),
      h1: String(fm.h1 ?? meta.label),
      lastVerified: String(fm.lastVerified ?? ''),
      html,
      tools: tools.map(toCardData),
    };
  },
);

/** Every (category, tool) pair — drives generateStaticParams for tool routes. */
export const getAllToolParams = cache(
  async (): Promise<Array<{ category: string; tool: string }>> => {
    const tools = await getAllTools();
    return tools.map((tool) => ({ category: tool.category, tool: tool.slug }));
  },
);

/**
 * Related tools for the sidebar: same category, never the current tool.
 * Prefers an explicitly linked `relatedTool` (our decision-guide convention)
 * so those pairs always cross-link.
 */
export const getRelatedTools = cache(
  async (
    categorySlug: string,
    toolSlug: string,
    limit = 4,
  ): Promise<ToolCardData[]> => {
    const [siblings, all] = await Promise.all([
      getToolsByCategory(categorySlug),
      getAllTools(),
    ]);

    const current = all.find((tool) => tool.slug === toolSlug);
    const picks: ToolEntry[] = [];

    if (current?.relatedTool) {
      const explicit = all.find((tool) => tool.slug === current.relatedTool);
      if (explicit) picks.push(explicit);
    }

    for (const tool of siblings) {
      if (picks.length >= limit) break;
      if (tool.slug === toolSlug) continue;
      if (picks.some((picked) => picked.slug === tool.slug)) continue;
      picks.push(tool);
    }

    return picks.slice(0, limit).map(toCardData);
  },
);

/** Total article count, used in hero copy and metadata. */
export const getToolCount = cache(async (): Promise<number> => {
  const tools = await getAllTools();
  return tools.length;
});

/**
 * Narrows a tool to the fields the client-side grid renders.
 *
 * Use this for anything crossing into a Client Component. Passing full
 * `ToolEntry` objects would serialise `file` (an internal repo path) and other
 * server-only fields into the RSC payload on every page load — about 8KB of
 * dead weight across 77 tools, plus needless disclosure of the content layout.
 */
export function toCardData(tool: ToolEntry): ToolCardData {
  return {
    slug: tool.slug,
    name: tool.name,
    vendor: tool.vendor,
    category: tool.category,
    functionalCategory: tool.functionalCategory,
    positioning: tool.positioning,
    freeTier: tool.freeTier,
    startingPrice: tool.startingPrice,
    bestFor: tool.bestFor,
    ...(tool.status ? { status: tool.status } : {}),
  };
}

/** All tools, projected for client-side rendering. */
export const getAllToolCards = cache(async (): Promise<ToolCardData[]> => {
  const tools = await getAllTools();
  return tools.map(toCardData);
});

/**
 * The name→destination lookup behind Enter-to-navigate.
 *
 * This is the narrowest projection in the file, and it is narrow for a reason:
 * unlike `getAllToolCards`, which is only needed on the two routes that render
 * a grid, this one rides in the ROOT LAYOUT and is therefore part of every
 * page's payload. The navbar search has to resolve a tool name into a URL from
 * an article page, where no tool array is otherwise in scope.
 *
 * Three short strings per tool keeps that under 5KB across 77 entries, and the
 * repeated keys compress away to a fraction of it. Do not widen this shape
 * without re-checking that number — `positioning` alone would roughly quadruple
 * it, on every route, to serve a feature that never reads it.
 */
export const getToolSearchIndex = cache(async (): Promise<ToolSearchEntry[]> => {
  const tools = await getAllTools();
  return tools.map((tool) => ({
    name: tool.name,
    slug: tool.slug,
    category: tool.category,
  }));
});
