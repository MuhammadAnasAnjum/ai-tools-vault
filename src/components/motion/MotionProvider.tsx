'use client';

import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Single Framer Motion provider for the whole app, mounted once in the root
 * layout.
 *
 * `LazyMotion` + `domAnimation` loads only the DOM animation features — roughly
 * 5kb, versus the ~34kb the full `motion` component pulls in. Mounting it once
 * means every animated component below shares that bundle instead of each
 * paying for its own. `strict` makes any `motion.div` usage throw in
 * development, which forces components to use the lightweight `m` export; one
 * stray `motion.` import would otherwise silently re-add the full bundle.
 *
 * `reducedMotion="user"` is the correct way to honour the OS setting. The
 * obvious alternative — branching on the `useReducedMotion()` hook — reads the
 * media query during render, where the server has no answer and the client does,
 * producing a hydration mismatch for exactly the users we were trying to help.
 * This config instead lets Framer Motion drop transform animations internally
 * while keeping opacity, with identical markup on both sides.
 *
 * This is a client component, but wrapping the tree does NOT make the tree
 * client-side: `children` arrive as an already-rendered Server Component
 * payload, so pages stay server-rendered and fully crawlable.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
