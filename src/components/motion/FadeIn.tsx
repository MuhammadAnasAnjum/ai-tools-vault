'use client';

import { m } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Soft entrance animation for below-the-fold blocks.
 *
 * Three constraints keep this cheap enough to leave Core Web Vitals alone:
 *
 * 1. It uses the `m` component and relies on the app-level `MotionProvider` for
 *    features, so no extra motion runtime is pulled in per usage.
 * 2. Only `opacity` and `transform` are animated. Both are composited on the
 *    GPU, so no layout or paint work is triggered and the main thread stays
 *    free for INP.
 * 3. `whileInView` with `once: true` means each element animates at most once,
 *    and elements the reader never scrolls to never animate at all.
 *
 * NEVER wrap the LCP element (the hero H1) in this. Anything animated from
 * opacity 0 by JS cannot paint until hydration finishes, which pushes LCP out
 * by however long the bundle takes to arrive. Above the fold, use the CSS-only
 * `animate-fade-up` utility instead — it runs off the stylesheet, not JS.
 */
export interface FadeInProps {
  children: ReactNode;
  /** Seconds. Keep small — long stagger delays read as jank, not polish. */
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li';
}

export default function FadeIn({
  children,
  delay = 0,
  className,
  as = 'div',
}: FadeInProps) {
  /**
   * `m[as]` is typed as a union of motion components, and TypeScript refuses to
   * call a union of JSX signatures. The cast narrows it to a single concrete
   * one, which is sound here because every prop passed below is shared by all
   * HTML motion components — only the rendered tag name differs.
   */
  const MotionTag = m[as] as typeof m.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
