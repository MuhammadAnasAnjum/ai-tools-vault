import { FALLBACK_ICON, categoryIcons } from '@/lib/site';

/**
 * Category icon as inline SVG.
 *
 * Deliberately not an icon library: `lucide-react` and friends would add a
 * client dependency and, for the navbar, several kilobytes of JS to draw six
 * static shapes. These are stroke paths rendered on the server — zero JS, zero
 * extra network requests, and they inherit `currentColor` so hover states are
 * pure CSS.
 *
 * `aria-hidden` because every icon here sits beside a visible text label; an
 * accessible name would make screen readers announce the category twice.
 */
export default function CategoryIcon({
  slug,
  className = 'h-4 w-4',
}: {
  slug: string;
  className?: string;
}) {
  const path = categoryIcons[slug] ?? FALLBACK_ICON;

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} />
    </svg>
  );
}
