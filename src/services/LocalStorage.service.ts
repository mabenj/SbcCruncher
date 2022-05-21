export function getItemOrNull<T>(key: string): T | null {
    const stored = localStorage.getItem(key);
    try {
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

export function setItem<T>(key: string, item: T): void {
    localStorage.setItem(key, JSON.stringify(item));
}

const LocalStorageService = {
    setItem,
    getItemOrNull
};

export default LocalStorageService;
