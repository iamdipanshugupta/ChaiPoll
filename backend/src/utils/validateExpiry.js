import dayjs from "dayjs";

// Check if a date is in the past (expired)
const isExpired = (expiresAt) => {
  return dayjs(expiresAt).isBefore(dayjs());
};

// Get human-readable time left
const timeLeft = (expiresAt) => {
  const now = dayjs();
  const exp = dayjs(expiresAt);
  const diffSeconds = exp.diff(now, "second");

  if (diffSeconds <= 0) return "Expired";

  const days = Math.floor(diffSeconds / 86400);
  const hours = Math.floor((diffSeconds % 86400) / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export { isExpired, timeLeft };
