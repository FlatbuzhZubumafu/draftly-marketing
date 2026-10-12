// Where Draftly is reviewed or listed (site audit D3.5). Empty until real
// profiles exist: the homepage strip and the footer slot render nothing while
// this list is empty. Add an entry only for a live listing, and copy the rating
// and review count from it exactly as shown there, with the date you checked.

export type ReviewProfile = {
  /** "Trustpilot", "G2", "Capterra", "Product Hunt" */
  site: string;
  url: string;
  /** Average rating as the site shows it, e.g. 4.8. Leave out if there is none yet. */
  rating?: number;
  /** The site's own scale, usually 5. */
  outOf?: number;
  reviewCount?: number;
  /** Short label for listings without ratings, e.g. "Featured on Product Hunt". */
  label?: string;
  /** ISO date the rating and count were copied from the site. */
  checked: string;
};

export const REVIEW_PROFILES: ReviewProfile[] = [];
