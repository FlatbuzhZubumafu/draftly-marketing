import { SquiggleUnderline } from "./SquiggleUnderline";

interface AccentTextProps {
  children: React.ReactNode;
  squiggle?: "basic" | "squiggle";
  color?: string;
  squiggleColor?: string;
  className?: string;
}

export function AccentText({
  children,
  squiggle = "basic",
  color = "var(--color-accent)",
  squiggleColor = "#ffce59",
  className = "",
}: AccentTextProps) {
  return (
    <span className={`relative inline-block ${className}`}>
      <em className="italic" style={{ color }}>
        {children}
      </em>
      <SquiggleUnderline variant={squiggle} color={squiggleColor} />
    </span>
  );
}
