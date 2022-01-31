export function getItemOrNull<T>(key: string): T | null {
	const stored = localStorage.getItem(key);
	return stored ? JSON.parse(stored) : null;
}

export function setItem<T>(key: string, item: T): void {
	localStorage.setItem(key, JSON.stringify(item));
}
