export function saveToStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  const data = localStorage.getItem(key);
  if (!data) return fallback;

  return JSON.parse(data, (_key, value) => {
    // Convert ISO strings to Date
    if (
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)
    ) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) return date;
    }
    return value;
  });
}
