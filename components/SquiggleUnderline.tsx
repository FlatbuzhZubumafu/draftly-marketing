interface SquiggleProps {
  variant?: "basic" | "squiggle";
  color?: string;
  className?: string;
}

export function SquiggleUnderline({
  variant = "basic",
  color = "#ffce59",
  className = "",
}: SquiggleProps) {
  if (variant === "squiggle") {
    return (
      <svg
        className={`absolute left-0 -bottom-2 w-full pointer-events-none ${className}`}
        role="presentation"
        viewBox="-347 -30.1947 694 96.19"
        preserveAspectRatio="none"
        style={{ height: "0.25em" }}
      >
        <path
          className="squiggle-path"
          d="M-335,54 C-335,54 -171,-58 -194,-3 C-217,52 -224.12,73.552 -127,11 C-68,-27 -137,50 -33,42 C31.44,37.043 147.147,-29.308 335,2"
          stroke={color}
          strokeWidth="10"
          pathLength="1"
          fill="none"
        />
      </svg>
    );
  }

  return (
    <svg
      className={`absolute left-0 -bottom-2 w-full pointer-events-none ${className}`}
      role="presentation"
      viewBox="-400 -55 730 60"
      preserveAspectRatio="none"
      style={{ height: "0.2em" }}
    >
      <path
        className="squiggle-path"
        d="m -383.25 -6 c 55.25 -22 130.75 -33.5 293.25 -38 c 54.5 -0.5 195 -2.5 401 15"
        stroke={color}
        strokeWidth="8"
        pathLength="1"
        fill="none"
      />
    </svg>
  );
}
