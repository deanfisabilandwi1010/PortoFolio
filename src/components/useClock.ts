import { useEffect, useState } from "react";

function format(timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
}

/** Wall-clock time in the given IANA zone, refreshed on the minute. */
export function useClock(timeZone: string) {
  const [time, setTime] = useState(() => format(timeZone));
  useEffect(() => {
    let timer = 0;
    const schedule = () => {
      const now = new Date();
      const ms = (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 50;
      timer = window.setTimeout(() => {
        setTime(format(timeZone));
        schedule();
      }, ms);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [timeZone]);
  return time;
}
