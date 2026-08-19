import type { Metadata } from 'next';

import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { getCategories, getToolCount } from '@/lib/content';
import { breadcrumbSchema } from '@/lib/schema';
import { siteConfig } from '@/lib/site';

const TITLE = 'How We Review AI Tools: Our Method and Standards';
const DESCRIPTION =
  'How reviews on this site are researched and verified — what we check, what we refuse to publish, and how editorial independence is maintained.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/about' },
};

/**
 * An editorial-standards page is not filler. Google's quality guidance leans
 * heavily on who produced the content and why it should be trusted, and any ad
 * network review looks for exactly this alongside a privacy policy. It also has
 * to be true: every claim below describes what the review process actually does.
 */
export default async function AboutPage() {
  const [toolCount, categories] = await Promise.all([getToolCount(), getCategories()]);
  const crumbs = [{ name: 'How we review', href: '/about' }];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <div className="container-prose pt-8">
        <Breadcrumbs items={crumbs} />
      </div>

      <article className="container-prose py-12">
        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-strong sm:text-4xl">
          How we review AI tools
        </h1>

        <div className="prose prose-ink mt-8 max-w-none prose-headings:font-display prose-headings:tracking-tight prose-h2:mt-10 prose-h2:text-2xl prose-a:text-link prose-strong:text-strong">
          <p>
            {siteConfig.name} publishes independent reviews of {toolCount} AI tools
            across {categories.length} categories. Every review is written to answer one
            question honestly: is this worth your money, and if not, who is it for
            instead?
          </p>

          <h2>What gets checked before publication</h2>
          <p>
            Pricing, plan names and feature claims are verified against the vendor&apos;s
            own current documentation at the time of writing, and each page carries the
            date that check happened. This category changes quickly. Tiers get renamed,
            free plans get withdrawn, and products are discontinued with little
            announcement, so a price quoted without a date is close to worthless.
          </p>
          <p>
            Where a figure comes from a secondary source rather than the vendor, the
            review says so. Where a widely repeated claim turned out to be wrong, we
            correct it in the text rather than repeat it: several tools in this
            directory are routinely described online as having features they have never
            shipped, or as being owned by companies that do not own them.
          </p>

          <h2>What we refuse to publish</h2>
          <p>
            We do not publish numeric scores or star ratings. Ratings imply a precision
            these comparisons do not have, and they invite the kind of structured-data
            gaming that turns a directory into noise. We also decline to cover tools we
            cannot verify: if a product has no identifiable owner, no documented
            pricing and no evidence of real use, a page about it would be filler.
            At least one tool has been dropped from this directory for exactly that
            reason.
          </p>
          <p>
            Reviews include the case against a tool as well as the case for it. A
            review with no drawbacks section is an advertisement, and readers can tell.
          </p>

          <h2>Where a tool does not fit its category</h2>
          <p>
            A few tools are filed in a category they only partly belong to, because
            that is where readers look for them. When that happens the review opens by
            saying so plainly rather than stretching the definition to fit.
          </p>

          <h2>Editorial independence</h2>
          <p>
            No vendor pays for inclusion, for placement, or for a favourable line, and
            no review is written or approved by the company being reviewed. Nothing on
            this site is a paid placement. If advertising is introduced later it will be
            labelled where it appears and kept out of the editorial process, and an ad
            next to a review will not be an endorsement of either party by the other.
          </p>

          <h2>Corrections</h2>
          <p>
            Facts in this category go stale rather than being wrong at the time of
            writing. If something here is out of date or inaccurate, it should be
            corrected rather than quietly left in place — the verification date on each
            page exists so you can judge how much weight to give it.
          </p>
        </div>
      </article>
    </>
  );
}
