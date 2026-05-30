import { useEffect, useState } from "react";

const CountdownTimer = ({ expiresAt, onExpire }) => {
  const calc = () => {
    const diff = Math.max(0, Math.floor((new Date(expiresAt) - Date.now()) / 1000));
    return {
      days: Math.floor(diff / 86400),
      hours: Math.floor((diff % 86400) / 3600),
      minutes: Math.floor((diff % 3600) / 60),
      seconds: diff % 60,
      total: diff,
    };
  };

  const [time, setTime] = useState(calc);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const t = calc();
      setTime(t);
      if (t.total === 0 && !expired) {
        setExpired(true);
        onExpire?.();
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (expired || time.total === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}>
        ⏱️ Poll Expired
      </div>
    );
  }

  const units = [
    { label: "Days", value: time.days },
    { label: "Hrs", value: time.hours },
    { label: "Min", value: time.minutes },
    { label: "Sec", value: time.seconds },
  ].filter((u, i) => i > 0 || u.value > 0); // hide days if 0

  const isUrgent = time.total < 3600; // last hour

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-medium" style={{ color: "var(--text3)" }}>⏱ Closes in</span>
      <div className="flex items-center gap-1.5">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-center gap-1.5">
            <div className="text-center">
              <div className={`countdown-num text-lg font-bold tabular-nums ${isUrgent ? "text-red-400" : ""}`}
                style={{ fontFamily: "'Syne', sans-serif", color: isUrgent ? "#f87171" : "var(--primary)" }}>
                {String(u.value).padStart(2, "0")}
              </div>
              <div className="countdown-label text-xs" style={{ color: "var(--text3)" }}>{u.label}</div>
            </div>
            {i < units.length - 1 && (
              <span className="text-lg font-bold mb-3" style={{ color: "var(--text3)" }}>:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
