import type { IconType } from "react-icons";
import { FaFacebookF, FaLinkedinIn, FaPinterestP, FaXTwitter } from "react-icons/fa6";

type Props = {
  url: string;
  title: string;
  image?: string;
  className?: string;
};

/**
 * Share row under a post: one brand icon per network, each a plain share link
 * (no scripts or tracking pixels from the networks).
 */
export function ShareLinks({ url, title, image, className = "" }: Props) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links: { name: string; href: string; Icon: IconType }[] = [
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, Icon: FaFacebookF },
    { name: "X", href: `https://x.com/intent/post?url=${u}&text=${t}`, Icon: FaXTwitter },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, Icon: FaLinkedinIn },
    ...(image
      ? [{ name: "Pinterest", href: `https://pinterest.com/pin/create/button/?url=${u}&media=${encodeURIComponent(image)}&description=${t}`, Icon: FaPinterestP }]
      : []),
  ];

  return (
    <div data-toc-skip className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Share</span>
      {links.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${name}`}
          title={`Share on ${name}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-900"
        >
          <Icon aria-hidden className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
