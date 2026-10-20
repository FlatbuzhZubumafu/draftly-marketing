import "./feature-art.css";

/**
 * Flat ink drawings that tease what each feature does, in a 320 x 200 box.
 * Colors come from the surrounding tint (--art-fill, --art-soft; see lib/feature-tints.ts).
 * Always decoration: aria-hidden, the card or section around it carries the words.
 * Motion and the reduced-motion static frame live in feature-art.css.
 */
export type ArtName =
  | "topic-ideas"
  | "seo-research"
  | "brand-voice"
  | "ai-models"
  | "writing-rules"
  | "ai-detector"
  | "editor"
  | "seo-meta"
  | "publishing"
  | "autopilot"
  | "analytics"
  | "mcp"
  | "wordpress-plugin"
  | "teams"
  | "stat-check";

export const ART_NAMES: readonly ArtName[] = [
  "topic-ideas", "seo-research", "brand-voice", "ai-models", "writing-rules", "ai-detector", "editor",
  "seo-meta", "publishing", "autopilot", "analytics", "mcp", "wordpress-plugin", "teams", "stat-check",
];

export const isArtName = (s: string): s is ArtName => (ART_NAMES as readonly string[]).includes(s);

const Check = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <path d={`M${x - 6 * s} ${y} l${4 * s} ${4 * s} l${8 * s} -${9 * s}`} fill="none" stroke="#111" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
);

/** A sheet of paper with a folded corner. */
const Doc = ({ x, y, w, h, className = "paper" }: { x: number; y: number; w: number; h: number; className?: string }) => (
  <path className={`ink ${className}`} d={`M${x} ${y} h${w - 16} l16 16 v${h - 16} h-${w} z M${x + w - 16} ${y} v16 h16`} />
);

function TopicIdeas() {
  const card = (cls: string) => (
    <g className={`card ${cls}`}>
      <rect className="ink paper" x="62" y="22" width="196" height="36" rx="6" />
      <rect className="ink soft thin" x="72" y="30" width="20" height="20" rx="3" />
      <line className="line-strong" x1="102" y1="36" x2="208" y2="36" />
      <line className="line" x1="102" y1="46" x2="176" y2="46" />
    </g>
  );
  return (
    <g className="fa-topics">
      {card("c1")}
      {card("c2")}
      {card("c3")}
      <g className="star box">
        <path className="ink fill" d="M270 22 l6 12 13 2 -9 9 2 13 -12 -6 -12 6 2 -13 -9 -9 13 -2 z" />
      </g>
    </g>
  );
}

function SeoResearch() {
  const bars = [60, 92, 48, 110, 76];
  return (
    <g className="fa-research">
      <line className="ink" x1="56" y1="170" x2="264" y2="170" />
      {bars.map((h, i) => (
        <rect key={i} className={`ink ${i === 3 ? "fill" : "soft"} bar from-bottom b${i + 1}`} x={72 + i * 38} y={170 - h} width="24" height={h} rx="3" />
      ))}
      <g className="lens">
        <circle className="ink" cx="84" cy="70" r="24" fill="rgba(255,255,255,0.55)" />
        <line className="ink" x1="101" y1="87" x2="118" y2="104" strokeWidth={6} />
      </g>
    </g>
  );
}

function BrandVoice() {
  const rows = [
    { y: 56, w: 60, k: "1" },
    { y: 102, w: 150, k: "2" },
    { y: 148, w: 80, k: "3" },
  ];
  return (
    <g className="fa-voice">
      {rows.map((r) => (
        <g key={r.k}>
          <rect className="ink paper" x="50" y={r.y - 7} width="220" height="14" rx="7" />
          <rect className={`fill from-left f${r.k}`} x="52" y={r.y - 5} width={r.w} height="10" rx="5" />
          <circle className={`ink paper box k${r.k}`} cx={52 + r.w} cy={r.y} r="13" />
        </g>
      ))}
    </g>
  );
}

function AiModels() {
  return (
    <g className="fa-models">
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect className="ink paper" x="40" y={40 + i * 42} width="118" height="32" rx="8" />
          <circle className={`ink ${i === 0 ? "fill" : "soft"} thin`} cx="58" cy={56 + i * 42} r="7" />
          <line className="line" x1="74" y1={56 + i * 42} x2={140 - i * 12} y2={56 + i * 42} />
        </g>
      ))}
      <rect className="ring" x="34" y="34" width="130" height="44" rx="11" fill="none" stroke="var(--art-fill)" strokeWidth="5" />
      <path className="ink" d="M172 96 h18 m-7 -7 l7 7 -7 7" fill="none" />
      <Doc x={202} y={40} w={84} h={112} />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} className={`line-strong from-left w w${i + 1}`} x1="214" y1={74 + i * 18} x2={i === 3 ? 250 : 272} y2={74 + i * 18} strokeOpacity={i === 0 ? 1 : 0.3} />
      ))}
    </g>
  );
}

function WritingRules() {
  return (
    <g className="fa-rules">
      <rect className="ink paper" x="40" y="30" width="240" height="140" rx="8" />
      <line className="line" x1="58" y1="54" x2="250" y2="54" />
      <line className="line" x1="58" y1="140" x2="230" y2="140" />
      <line className="line" x1="58" y1="156" x2="180" y2="156" />
      <rect className="ink soft thin" x="56" y="80" width="98" height="34" rx="6" />
      <text x="105" y="103" fontSize="17" textAnchor="middle">seamless</text>
      <line className="strike from-left" x1="62" y1="97" x2="148" y2="97" stroke="#111" strokeWidth="3.5" strokeLinecap="round" />
      <path className="ink" d="M162 97 h14 m-6 -6 l6 6 -6 6" fill="none" />
      <g className="new">
        <rect className="ink fill thin" x="184" y="80" width="80" height="34" rx="6" />
        <text x="224" y="103" fontSize="17" textAnchor="middle">simple</text>
      </g>
      <g className="badge box">
        <circle className="ink paper" cx="268" cy="44" r="16" />
        <Check x={268} y={45} />
      </g>
    </g>
  );
}

function AiDetector() {
  // Gauge centered at (160, 150), radius 92. The needle rotates around that point.
  return (
    <g className="fa-detector">
      <path className="ink soft" d="M68 150 A92 92 0 0 1 114 70 L137 110 A46 46 0 0 0 114 150 Z" />
      <path className="ink paper" d="M114 70 A92 92 0 0 1 206 70 L183 110 A46 46 0 0 0 137 110 Z" />
      <path className="ink fill" d="M206 70 A92 92 0 0 1 252 150 L206 150 A46 46 0 0 0 183 110 Z" />
      <line className="ink" x1="60" y1="150" x2="260" y2="150" />
      <g className="needle" style={{ transformBox: "view-box", transformOrigin: "160px 150px", transform: "rotate(-58deg)" }}>
        <path className="inkfill" d="M156 150 L160 70 L164 150 Z" />
      </g>
      <circle className="ink paper" cx="160" cy="150" r="10" />
      <text x="88" y="182" fontSize="13">human</text>
      <text x="214" y="182" fontSize="13">AI</text>
    </g>
  );
}

function Editor() {
  return (
    <g className="fa-editor">
      <rect className="ink paper" x="36" y="28" width="248" height="144" rx="8" />
      <line className="ink thin" x1="36" y1="50" x2="284" y2="50" />
      <circle className="inkfill" cx="52" cy="39" r="3.5" />
      <circle className="inkfill" cx="64" cy="39" r="3.5" />
      <line className="line" x1="56" y1="72" x2="262" y2="72" />
      <rect className="hl soft from-left" x="50" y="88" width="218" height="24" rx="5" />
      <line className="line old" x1="56" y1="100" x2="250" y2="100" strokeOpacity={0.35} />
      <line className="new" x1="56" y1="100" x2="214" y2="100" stroke="var(--art-fill)" strokeWidth="6" strokeLinecap="round" />
      <line className="line" x1="56" y1="128" x2="240" y2="128" />
      <line className="line" x1="56" y1="148" x2="196" y2="148" />
      <path className="ink paper" d="M232 118 l26 -26 10 10 -26 26 -14 4 z" />
    </g>
  );
}

function SeoMeta() {
  return (
    <g className="fa-meta">
      <rect className="ink paper" x="36" y="30" width="248" height="140" rx="8" />
      <circle className="ink soft thin" cx="60" cy="58" r="9" />
      <line className="line-strong from-left w w1" x1="78" y1="58" x2="164" y2="58" strokeOpacity={0.35} />
      <line className="from-left w w2" x1="56" y1="88" x2="238" y2="88" stroke="var(--art-fill)" strokeWidth="9" strokeLinecap="round" />
      <line className="line from-left w w3" x1="56" y1="116" x2="258" y2="116" />
      <line className="line from-left w w4" x1="56" y1="134" x2="212" y2="134" />
      <g className="badge box">
        <rect className="ink fill" x="206" y="140" width="64" height="26" rx="13" />
        <Check x={226} y={153} s={0.8} />
        <text x="236" y="158" fontSize="13">60</text>
      </g>
    </g>
  );
}

function Publishing() {
  const tiles = [0, 1, 2, 3, 4, 5];
  return (
    <g className="fa-publish">
      {tiles.map((i) => {
        const x = 176 + (i % 3) * 38;
        const y = 50 + Math.floor(i / 3) * 52;
        return <rect key={i} className="ink paper" x={x} y={y} width="30" height="40" rx="6" />;
      })}
      <rect className="lit ink fill" x="176" y="50" width="30" height="40" rx="6" />
      <g className="post box">
        <Doc x={40} y={60} w={74} h={92} />
        <line className="line-strong" x1="52" y1="88" x2="94" y2="88" />
        <line className="line" x1="52" y1="104" x2="100" y2="104" />
        <line className="line" x1="52" y1="120" x2="90" y2="120" />
      </g>
      <path className="ink" d="M126 106 h30 m-8 -8 l8 8 -8 8" fill="none" strokeDasharray="0" />
    </g>
  );
}

function Autopilot() {
  const cells = Array.from({ length: 12 }, (_, i) => i);
  const dots = [1, 4, 7, 10];
  return (
    <g className="fa-auto">
      <rect className="ink paper" x="36" y="36" width="160" height="134" rx="8" />
      <path className="ink fill" d="M36 44 a8 8 0 0 1 8 -8 h144 a8 8 0 0 1 8 8 v18 h-160 z" />
      {cells.map((i) => (
        <rect key={i} x={48 + (i % 4) * 36} y={74 + Math.floor(i / 4) * 32} width="28" height="24" rx="4" fill="none" stroke="#111" strokeOpacity="0.2" strokeWidth="2" />
      ))}
      {dots.map((c, i) => (
        <circle key={c} className={`ink fill thin dot box d${i + 1}`} cx={62 + (c % 4) * 36} cy={86 + Math.floor(c / 4) * 32} r="7" />
      ))}
      <circle className="ink paper" cx="246" cy="104" r="40" />
      <circle className="soft" cx="246" cy="104" r="30" />
      <g className="hand" style={{ transformBox: "view-box", transformOrigin: "246px 104px" }}>
        <line className="ink" x1="246" y1="104" x2="246" y2="78" strokeWidth={4} />
      </g>
      <line className="ink" x1="246" y1="104" x2="262" y2="104" strokeWidth={4} />
      <circle className="inkfill" cx="246" cy="104" r="4" />
    </g>
  );
}

function Analytics() {
  const bars = [34, 52, 46, 74, 100];
  return (
    <g className="fa-analytics">
      <line className="ink" x1="50" y1="30" x2="50" y2="170" />
      <line className="ink" x1="50" y1="170" x2="270" y2="170" />
      {bars.map((h, i) => (
        <rect key={i} className={`ink ${i === 4 ? "fill" : "soft"} bar from-bottom b${i + 1}`} x={68 + i * 38} y={170 - h} width="24" height={h} rx="3" />
      ))}
      <g className="arrow box">
        <circle className="ink paper" cx="250" cy="44" r="18" />
        <path className="ink" d="M242 52 l16 -16 m-10 0 h10 v10" fill="none" />
      </g>
    </g>
  );
}

function Mcp() {
  return (
    <g className="fa-mcp">
      <path className="ink paper" d="M30 50 h96 a8 8 0 0 1 8 8 v54 a8 8 0 0 1 -8 8 h-60 l-16 14 v-14 h-20 a8 8 0 0 1 -8 -8 v-54 a8 8 0 0 1 8 -8 z" />
      <line className="line-strong" x1="40" y1="72" x2="116" y2="72" strokeOpacity={0.5} />
      <line className="line" x1="40" y1="88" x2="104" y2="88" />
      <line className="line" x1="40" y1="104" x2="92" y2="104" />
      <line x1="140" y1="92" x2="200" y2="92" stroke="#111" strokeWidth="3" strokeDasharray="4 6" strokeLinecap="round" />
      {[1, 2, 3].map((i) => (
        <circle key={i} className={`fill pkt p${i}`} cx="128" cy="92" r="6" stroke="#111" strokeWidth="2" />
      ))}
      <Doc x={210} y={44} w={82} h={104} />
      <rect className="fill" x="222" y="70" width="34" height="8" rx="4" />
      <line className="line" x1="222" y1="94" x2="278" y2="94" />
      <line className="line" x1="222" y1="110" x2="270" y2="110" />
      <g className="badge box">
        <circle className="ink paper" cx="284" cy="146" r="15" />
        <Check x={284} y={147} s={0.85} />
      </g>
    </g>
  );
}

function WordpressPlugin() {
  return (
    <g className="fa-wp">
      <rect className="ink paper" x="34" y="26" width="252" height="150" rx="8" />
      <path className="ink soft" d="M34 34 a8 8 0 0 1 8 -8 h236 a8 8 0 0 1 8 8 v16 h-252 z" />
      <circle className="ink paper thin" cx="52" cy="38" r="7" />
      <line className="line" x1="54" y1="70" x2="230" y2="70" />
      <line className="line old" x1="54" y1="88" x2="250" y2="88" />
      <line className="fixed" x1="54" y1="88" x2="200" y2="88" stroke="var(--art-fill)" strokeWidth="6" strokeLinecap="round" />
      <line className="line" x1="54" y1="106" x2="214" y2="106" />
      <g className="pop">
        <rect className="ink paper" x="118" y="114" width="150" height="50" rx="8" />
        <g className="ok box">
          <rect className="ink fill" x="130" y="126" width="62" height="26" rx="6" />
          <Check x={161} y={139} s={0.8} />
        </g>
        <rect className="ink paper thin" x="202" y="126" width="54" height="26" rx="6" />
        <line className="line" x1="216" y1="139" x2="242" y2="139" />
      </g>
    </g>
  );
}

function Teams() {
  const person = (cx: number, cls: string) => (
    <g className={`p box ${cls}`}>
      <circle className="ink fill" cx={cx} cy="138" r="13" />
      <path className="ink paper" d={`M${cx - 20} 178 a20 18 0 0 1 40 0 z`} />
    </g>
  );
  return (
    <g className="fa-teams">
      <g className="site2 box">
        <rect className="ink soft" x="110" y="24" width="112" height="86" rx="8" />
      </g>
      <rect className="ink paper" x="98" y="32" width="112" height="86" rx="8" />
      <path className="ink fill" d="M98 40 a8 8 0 0 1 8 -8 h96 a8 8 0 0 1 8 8 v8 h-112 z" />
      <line className="line" x1="112" y1="68" x2="190" y2="68" />
      <line className="line" x1="112" y1="84" x2="176" y2="84" />
      <line className="line" x1="112" y1="100" x2="184" y2="100" />
      {person(112, "pp1")}
      {person(160, "pp2")}
      {person(208, "pp3")}
    </g>
  );
}

function StatCheck() {
  return (
    <g className="fa-stat">
      <rect className="ink paper" x="40" y="28" width="240" height="146" rx="8" />
      <line className="line" x1="58" y1="54" x2="250" y2="54" />
      <line className="line" x1="58" y1="72" x2="214" y2="72" />
      <rect className="ink soft thin" x="56" y="90" width="64" height="32" rx="6" />
      <text x="88" y="112" fontSize="18" textAnchor="middle">73%</text>
      <ellipse className="ring box" cx="88" cy="106" rx="44" ry="26" fill="none" stroke="var(--art-fill)" strokeWidth="4" />
      <line className="line" x1="132" y1="106" x2="250" y2="106" />
      <line className="line" x1="58" y1="140" x2="236" y2="140" />
      <line className="line" x1="58" y1="156" x2="190" y2="156" />
      <g className="flag box">
        <rect className="ink fill" x="150" y="80" width="112" height="30" rx="15" />
        <text x="206" y="100" fontSize="13" textAnchor="middle">No source</text>
      </g>
    </g>
  );
}

const ART: Record<ArtName, () => React.ReactElement> = {
  "topic-ideas": TopicIdeas,
  "seo-research": SeoResearch,
  "brand-voice": BrandVoice,
  "ai-models": AiModels,
  "writing-rules": WritingRules,
  "ai-detector": AiDetector,
  editor: Editor,
  "seo-meta": SeoMeta,
  publishing: Publishing,
  autopilot: Autopilot,
  analytics: Analytics,
  mcp: Mcp,
  "wordpress-plugin": WordpressPlugin,
  teams: Teams,
  "stat-check": StatCheck,
};

export function FeatureArt({ name, className = "" }: { name: ArtName; className?: string }) {
  const Art = ART[name];
  return (
    <svg className={`fa ${className}`} viewBox="0 0 320 200" aria-hidden="true" focusable="false">
      <Art />
    </svg>
  );
}

/** Hub hero: a topic becomes a draft, gets checked and goes live, on a loop. */
const FLOW = [
  { x: 24, y: 24, label: "1. Topic", bg: "#fff6db", fill: "#ffc53d", soft: "#ffe39a" },
  { x: 276, y: 24, label: "2. Draft", bg: "#f4ecfc", fill: "#b483e6", soft: "#dcc5f4" },
  { x: 276, y: 226, label: "3. Check", bg: "#ffece5", fill: "#ff7a4d", soft: "#ffc0a8" },
  { x: 24, y: 226, label: "4. Publish", bg: "#e6f2fb", fill: "#4ea5e0", soft: "#b4d9f2" },
] as const;

export function HeroFlowArt({ className = "" }: { className?: string }) {
  const W = 220;
  const H = 170;
  return (
    <svg className={`fa fa-flow ${className}`} viewBox="0 0 520 420" aria-hidden="true" focusable="false">
      {/* connectors between the stages */}
      <path className="ink" d="M250 109 h20 m-7 -7 l7 7 -7 7" fill="none" />
      <path className="ink" d="M386 200 v20 m-7 -7 l7 7 7 -7" fill="none" />
      <path className="ink" d="M270 311 h-20 m7 -7 l-7 7 7 7" fill="none" />
      {FLOW.map((s, i) => (
        <g key={s.label} className={`stage box s${i + 1}`} style={{ ["--art-fill" as string]: s.fill, ["--art-soft" as string]: s.soft }}>
          <rect className="ink" x={s.x} y={s.y} width={W} height={H} rx="14" fill={s.bg} />
          <text x={s.x + 18} y={s.y + 32} fontSize="17">{s.label}</text>
          <g className={`box t${i + 1}`}>
            <circle className="ink fill" cx={s.x + W - 26} cy={s.y + 26} r="14" />
            <Check x={s.x + W - 26} y={s.y + 27} s={0.8} />
          </g>
          {i === 0 ? (
            <g>
              <rect className="ink paper" x={s.x + 18} y={s.y + 52} width="184" height="44" rx="7" />
              <rect className="ink soft thin" x={s.x + 28} y={s.y + 62} width="24" height="24" rx="4" />
              <line className="line-strong" x1={s.x + 64} y1={s.y + 68} x2={s.x + 186} y2={s.y + 68} />
              <line className="line" x1={s.x + 64} y1={s.y + 82} x2={s.x + 150} y2={s.y + 82} />
              <rect className="ink paper" x={s.x + 18} y={s.y + 106} width="184" height="44" rx="7" style={{ opacity: 0.55 }} />
              <line className="line" x1={s.x + 64} y1={s.y + 122} x2={s.x + 176} y2={s.y + 122} />
              <rect className="ink soft thin" x={s.x + 28} y={s.y + 116} width="24" height="24" rx="4" style={{ opacity: 0.55 }} />
            </g>
          ) : null}
          {i === 1 ? (
            <g>
              <Doc x={s.x + 44} y={s.y + 46} w={132} h={110} />
              <rect className="fill" x={s.x + 58} y={s.y + 70} width="70" height="9" rx="4.5" />
              {[0, 1, 2, 3].map((l) => (
                <line key={l} className="line from-left w" x1={s.x + 58} y1={s.y + 96 + l * 15} x2={s.x + (l === 3 ? 130 : 160)} y2={s.y + 96 + l * 15} />
              ))}
            </g>
          ) : null}
          {i === 2 ? (
            <g>
              <path className="ink soft" d={`M${s.x + 40} ${s.y + 146} A70 70 0 0 1 ${s.x + 180} ${s.y + 146} Z`} />
              <path className="ink fill" d={`M${s.x + 145} ${s.y + 85.4} A70 70 0 0 1 ${s.x + 180} ${s.y + 146} L${s.x + 110} ${s.y + 146} Z`} />
              <g className="needle" style={{ transformBox: "view-box", transformOrigin: `${s.x + 110}px ${s.y + 146}px`, transform: "rotate(-58deg)" }}>
                <path className="inkfill" d={`M${s.x + 107} ${s.y + 146} L${s.x + 110} ${s.y + 86} L${s.x + 113} ${s.y + 146} Z`} />
              </g>
              <circle className="ink paper" cx={s.x + 110} cy={s.y + 146} r="8" />
            </g>
          ) : null}
          {i === 3 ? (
            <g>
              <rect className="ink paper" x={s.x + 22} y={s.y + 50} width="176" height="102" rx="8" />
              <path className="ink soft" d={`M${s.x + 22} ${s.y + 58} a8 8 0 0 1 8 -8 h160 a8 8 0 0 1 8 8 v12 h-176 z`} />
              <rect className="ink fill" x={s.x + 36} y={s.y + 84} width="54" height="22" rx="11" />
              <text x={s.x + 63} y={s.y + 100} fontSize="12" textAnchor="middle">Live</text>
              <line className="line-strong" x1={s.x + 36} y1={s.y + 120} x2={s.x + 176} y2={s.y + 120} />
              <line className="line" x1={s.x + 36} y1={s.y + 136} x2={s.x + 150} y2={s.y + 136} />
            </g>
          ) : null}
        </g>
      ))}
    </svg>
  );
}
