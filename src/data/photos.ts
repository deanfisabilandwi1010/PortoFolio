// Personal photos shown in the desktop viewer. Original colours, never upscaled.
export type Photo = { src: string; width: number; height: number; alt: string; caption: string };

export const photos = {
  portrait: {
    src: "/assets/photos/portrait-studio.webp",
    width: 1067,
    height: 1600,
    alt: "Full studio portrait: Dean in a dark suit seated on a tall stool, under a softbox, against a grey backdrop",
    caption: "Studio session — full frame",
  },
  photobooth: {
    src: "/assets/photos/photobooth.webp",
    width: 800,
    height: 600,
    alt: "Four-frame webcam photo booth collage with a halftone filter, Dean posing with different expressions",
    caption: "Webcam photo booth, halftone filter — shown at original size",
  },
  afterHours: {
    src: "/assets/photos/after-hours.webp",
    width: 1600,
    height: 1066,
    alt: "Dean in glasses and a black hoodie, leaning an arm on an anatomical skeleton model wearing a beanie and a red waist bag",
    caption: "After hours",
  },
} satisfies Record<string, Photo>;
