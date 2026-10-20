import type { Rect, Size } from "../desktop/windowGeometry";
import { ICON_COLUMN } from "../desktop/windowGeometry";
import { profile } from "./portfolio";

export type WindowId = "about" | "dayjob" | "portrait" | "photobooth" | "afterHours" | "projects" | "contact";

export type DesktopApp = {
  id: WindowId;
  /** File name shown under the icon and in the taskbar */
  file: string;
  /** Window title */
  title: string;
  kind: "text" | "photo" | "folder";
  thumb?: string;
  /** Layout from desktop size; clamped afterwards */
  layout: (b: Size) => Rect;
};

export type DesktopLink = { id: "github"; file: string; href: string };

const usable = (b: Size) => Math.max(320, b.width - ICON_COLUMN);

export const desktopApps: DesktopApp[] = [
  {
    id: "projects",
    file: "Projects",
    title: "Projects",
    kind: "folder",
    layout: (b) => ({ x: 24, y: b.height - 500 - 24, width: Math.min(560, usable(b) - 48), height: 500 }),
  },
  {
    id: "about",
    file: "About Me.txt",
    title: "About Me.txt",
    kind: "text",
    layout: (b) => ({ x: Math.min(120, b.width * 0.08), y: 36, width: 520, height: 460 }),
  },
  {
    id: "dayjob",
    file: "Day Job.txt",
    title: `Day Job.txt — ${profile.company}`,
    kind: "text",
    layout: (b) => ({ x: usable(b) * 0.28, y: 56, width: 560, height: 480 }),
  },
  {
    id: "portrait",
    file: "Portrait.jpg",
    title: `Portrait — ${profile.name}`,
    kind: "photo",
    thumb: "/assets/thumbs/portrait.webp",
    layout: (b) => ({ x: usable(b) * 0.42, y: 24, width: 400, height: Math.min(600, b.height - 48) }),
  },
  {
    id: "photobooth",
    file: "Photo Booth.jpg",
    title: "Photo Booth.jpg",
    kind: "photo",
    thumb: "/assets/thumbs/photobooth.webp",
    layout: (b) => ({ x: usable(b) * 0.2, y: 48, width: 620, height: 520 }),
  },
  {
    id: "afterHours",
    file: "After Hours.png",
    title: "After Hours.png",
    kind: "photo",
    thumb: "/assets/thumbs/after-hours.webp",
    layout: (b) => ({ x: usable(b) * 0.3, y: 72, width: 680, height: 520 }),
  },
  {
    id: "contact",
    file: "Contact.txt",
    title: "Contact.txt",
    kind: "text",
    layout: (b) => ({ x: usable(b) * 0.5, y: b.height * 0.3, width: 420, height: 300 }),
  },
];

export const desktopLinks: DesktopLink[] = profile.githubUrl ? [{ id: "github", file: "GitHub.url", href: profile.githubUrl }] : [];

export const appById = Object.fromEntries(desktopApps.map((a) => [a.id, a])) as Record<WindowId, DesktopApp>;

export const windowIds = desktopApps.map((a) => a.id);
