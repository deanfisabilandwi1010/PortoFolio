// Motion baseline. Values are tuned targets, not measurements of the reference site.
export const ease = {
  out: "power3.out",
  soft: "power2.out",
  in: "power2.in",
} as const;

export const duration = {
  wordmark: 0.75,
  line: 0.6,
  lineStagger: 0.08,
  reveal: 0.5,
  header: 0.22,
  cards: 0.45,
  cardStagger: 0.07,
  windowOpen: 0.22,
  windowClose: 0.15,
  minimize: 0.18,
} as const;

export const INTRO_KEY = "dfa:intro-seen";
