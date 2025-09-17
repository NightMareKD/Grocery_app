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

export function getExpiryStatus(expiryDateStr) {
  if (!expiryDateStr) return { label: 'No date', variant: 'neutral', daysLeft: null };
  const today = new Date();
  const target = new Date(expiryDateStr);
  const diffMs = target.setHours(0,0,0,0) - today.setHours(0,0,0,0);
  const days = Math.round(diffMs / 86400000);
  if (days < 0) return { label: 'Expired', variant: 'danger', daysLeft: days };
  if (days === 0) return { label: 'Today', variant: 'warning', daysLeft: days };
  if (days <= 3) return { label: `${days}d left`, variant: 'warning', daysLeft: days };
  return { label: `${days}d left`, variant: 'ok', daysLeft: days };
}