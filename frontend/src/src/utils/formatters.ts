export const formatDuration = (hours: number) => {
  if (hours < 24) {
    return `${hours} hrs`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (remainingHours === 0) {
    return `${days} day${days > 1 ? "s" : ""}`;
  }

  return `${days} day${days > 1 ? "s" : ""} ${remainingHours} hr${remainingHours > 1 ? "s" : ""}`;
};