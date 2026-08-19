import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';

import type { Faq } from './types';

/**
 * Markdown -> HTML. Runs at build time over our own content files only, so the
 * output is trusted; `allowDangerousHtml` stays off regardless, meaning any raw
 * HTML in a source file is dropped rather than passed through.
 *
 * rehype-slug adds stable `id`s to headings, which gives us in-page anchors and
 * lets Google surface jump links for the FAQ and feature sections.
 */
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeStringify);

export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await processor.process(markdown);
  return String(file);
}

/**
 * Removes the first ATX H1 from a markdown body.
 *
 * Our articles repeat their `h1` frontmatter value as a `# Heading`. The page
 * renders the frontmatter value in a real <h1>, so the body copy must not also
 * emit one — two H1s on a page is a semantic-structure problem.
 */
export function stripLeadingH1(markdown: string): string {
  return markdown.replace(/^\s*#[^\n#][^\n]*\n?/, '').trimStart();
}

/**
 * Drops the trailing verification footer (the `---` rule plus the italic line
 * after it) so it can be rendered separately as a citation-style block rather
 * than as body prose.
 */
export function splitVerificationFooter(markdown: string): {
  body: string;
  footer: string | null;
} {
  const match = markdown.match(/\n---\s*\n+\s*\*(.+?)\*\s*$/s);
  if (!match) return { body: markdown, footer: null };
  const footer = (match[1] ?? '').replace(/\s+/g, ' ').trim();
  return {
    body: markdown.slice(0, match.index ?? markdown.length).trimEnd(),
    footer: footer || null,
  };
}

/**
 * Pulls `**Question?**` / answer pairs out of the `### FAQs` section.
 * Used to build FAQPage structured data from the real on-page copy — the schema
 * and the visible text stay identical, which is what Google requires.
 */
export function extractFaqs(markdown: string): Faq[] {
  const start = markdown.search(/^#{2,4}\s+FAQs?\s*$/m);
  if (start === -1) return [];

  const section = markdown.slice(start);
  const pattern = /\*\*(.+?)\*\*\s*\n+([\s\S]*?)(?=\n\s*\*\*|\n\s*---|\n\s*#{2,4}\s|$)/g;

  const faqs: Faq[] = [];
  for (const match of section.matchAll(pattern)) {
    const question = (match[1] ?? '').replace(/\s+/g, ' ').trim();
    const answer = (match[2] ?? '')
      .replace(/[*_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (question.length > 3 && answer.length > 20) {
      faqs.push({ question, answer });
    }
  }
  return faqs;
}

/** Rough reading time, floored at one minute. */
export function readingMinutes(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
