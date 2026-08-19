import type { Metadata } from 'next';

import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { siteConfig } from '@/lib/site';

const TITLE = 'Privacy Policy';
const DESCRIPTION =
  'How this site handles data and cookies, what it does not collect, and the choices available to you.';

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | ${siteConfig.name}` },
  description: DESCRIPTION,
  alternates: { canonical: '/privacy' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/privacy' },
};

/**
 * Describes the site as it actually behaves today: no ad script is loaded and
 * no advertising cookies are set, because the ad layer has been removed.
 *
 * ACTION REQUIRED BEFORE ENABLING ADSENSE: this section must be rewritten
 * before any ad script ships, not after. Google's programme policies require a
 * privacy policy that already discloses third-party cookie use and links to the
 * opt-out at the moment ads begin serving — publishing the script first and the
 * disclosure later is itself the policy violation. Serving EU or UK visitors
 * additionally requires a certified consent management platform, which is a
 * separate integration this page does not provide.
 *
 * This remains a template, not legal advice. Before launch it needs a real
 * contact address and review against the operator's actual obligations.
 */
export default function PrivacyPage() {
  const crumbs = [{ name: 'Privacy policy', href: '/privacy' }];
  const updated = '10 August 2026';

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <div className="container-prose pt-8">
        <Breadcrumbs items={crumbs} />
      </div>

      <article className="container-prose py-12">
        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-strong sm:text-4xl">
          Privacy policy
        </h1>
        <p className="mt-3 text-sm text-muted">Last updated {updated}</p>

        <div className="prose prose-ink mt-8 max-w-none prose-headings:font-display prose-headings:tracking-tight prose-h2:mt-10 prose-h2:text-2xl prose-a:text-link prose-strong:text-strong">
          <p>
            This policy explains what happens to data when you visit{' '}
            {siteConfig.name}.
          </p>

          <h2>What we collect directly</h2>
          <p>
            We do not ask you to create an account, and there is no newsletter signup
            or contact form on this site, so we do not collect names or email
            addresses. The search and filter controls run entirely in your browser;
            what you type into them is never sent to us.
          </p>

          <h2>Advertising</h2>
          <p>
            This site does not currently load any advertising script and does not set
            advertising cookies. If advertising is added later, this policy will be
            updated before any ad script is enabled, and will describe the vendors
            involved and how to opt out of personalised advertising.
          </p>

          <h2>Analytics</h2>
          <p>
            Aggregate hosting logs may record standard request information such as
            approximate location, referring page and browser type. This is used to
            understand traffic volume, not to identify individuals.
          </p>

          <h2>Links to other sites</h2>
          <p>
            Reviews link to the official websites of the tools they cover. Those sites
            have their own privacy policies and this one does not apply to them.
          </p>

          <h2>Your choices</h2>
          <p>
            Most browsers let you block or delete cookies through their settings.
            Blocking cookies will not prevent you from reading anything on this site;
            every review is readable without them.
          </p>

          <h2>Children</h2>
          <p>
            This site is written for a general adult audience and is not directed at
            children under 13. We do not knowingly collect information from them.
          </p>

          <h2>Changes</h2>
          <p>
            If this policy changes, the date at the top of this page will change with
            it.
          </p>
        </div>
      </article>
    </>
  );
}
