export function formatDistanceToNow(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 0) {
    const pastDays = Math.abs(diffInDays);
    if (pastDays === 0) return 'Today';
    if (pastDays === 1) return 'Yesterday';
    return `${pastDays} days ago`;
  }
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Tomorrow';
  if (diffInDays <= 7) return `${diffInDays} days`;
  if (diffInDays <= 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? '1 week' : `${weeks} weeks`;
  }
  if (diffInDays <= 365) {
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? '1 month' : `${months} months`;
  }
  
  const years = Math.floor(diffInDays / 365);
  return years === 1 ? '1 year' : `${years} years`;
}

export function isAfter(date1, date2) {
  return new Date(date1).getTime() > new Date(date2).getTime();
}

export function differenceInDays(date1, date2) {
  const diffInMs = new Date(date1).getTime() - new Date(date2).getTime();
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
}