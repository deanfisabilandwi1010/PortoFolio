import { profile } from "../data/portfolio";
import { useClock } from "./useClock";

export function Clock({ prefix = "Local time" }: { prefix?: string }) {
  const time = useClock(profile.timezone);
  return (
    <span className="label-mono" aria-label={`${prefix}: ${time} ${profile.timezoneLabel}`}>
      {prefix && <span aria-hidden>{prefix} </span>}
      <time aria-hidden>{time}</time>
      <span aria-hidden> {profile.timezoneLabel}</span>
    </span>
  );
}
