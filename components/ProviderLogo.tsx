import { PROVIDER_MARKS } from "@/lib/provider-marks";
import { providerOf } from "@/lib/providers";

type LogoProps = {
  /** "Anthropic", "OpenAI", ... Falls back to providerOf(model). */
  provider?: string;
  model?: string;
  size?: number;
  /** Decorative by default: the model name sits right beside it. Pass false to label it. */
  decorative?: boolean;
  className?: string;
};

/** A provider's mark as inline SVG. Renders nothing for a provider we have no mark for. */
export function ProviderLogo({ provider, model, size = 20, decorative = true, className = "" }: LogoProps) {
  const name = provider ?? (model ? providerOf(model) : undefined);
  const paths = name ? PROVIDER_MARKS[name] : undefined;
  if (!name || !paths) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`flex-none ${className}`}
      fill="currentColor"
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": name })}
      focusable="false"
    >
      {!decorative && <title>{name}</title>}
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.fill} fillRule={p.evenodd ? "evenodd" : undefined} />
      ))}
    </svg>
  );
}

/** A model name with its provider's mark in front, for table cells, cards and lists. */
export function ModelName({
  model,
  provider,
  size = 20,
  className = "",
  children,
}: {
  model: string;
  provider?: string;
  size?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const name = provider ?? providerOf(model);
  return (
    <span className={`inline-flex items-center ${className}`} style={{ gap: Math.round(size * 0.45) }} title={name ? `${model} by ${name}` : undefined}>
      {name && PROVIDER_MARKS[name] ? <ProviderLogo provider={name} size={size} /> : <span aria-hidden="true" className="flex-none" style={{ width: size }} />}
      <span>{children ?? model}</span>
    </span>
  );
}
