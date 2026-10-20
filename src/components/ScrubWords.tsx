import { Fragment } from "react";

/**
 * Paragraph whose words fill in one by one as it scrolls through the viewport
 * (driven by useReveal via [data-scrub-words]). Plain readable text without JS.
 */
export function ScrubWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <p className={className} data-scrub-words>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span data-word>{w}</span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </p>
  );
}
