import { getHomepageData } from "@/lib/graphql";

export async function ScrollingBands() {
  const { marketingSettings: s } = await getHomepageData();

  const band1Text = s.scrollBand1Text || "Write Better Content";
  const band2Text = s.scrollBand2Text || "Stay In the Conversation";

  const renderItems = (text: string) =>
    Array.from({ length: 10 }).map((_, i) => (
      <span key={i} className={`marquee-item ${i % 2 === 0 ? "filled" : "outline"}`}>
        {text}
      </span>
    ));

  return (
    <div className="marquee-wrapper" style={{ background: "var(--color-bg-primary)" }}>
      <div className="marquee-track">
        {renderItems(band1Text)}
        {renderItems(band1Text)}
      </div>
    </div>
  );
}
