export const base = "https://jacoblincool.github.io/avatars";

let index: Record<string, string[]> | null = null;
export async function fetch_index(): Promise<Record<string, string[]>> {
    if (index) {
        return index;
    }

    const cache = await caches.open("avatar-index");
    const cached = await cache.match(`${base}/index.json`);
    if (cached) {
        index = await cached.json<Record<string, string[]>>();
        return index;
    }

    const res = await fetch(`${base}/index.json`);
    if (res.ok) {
        cache.put(`${base}/index.json`, res.clone());
        index = await res.json<Record<string, string[]>>();
        return index;
    } else {
        throw new Error(`Failed to fetch index: ${res.status} ${res.statusText}`);
    }
}

export async function random(collection?: string): Promise<string> {
    const index = await fetch_index();

    if (!(collection && index[collection])) {
        const keys = Object.keys(index);
        collection = keys[Math.floor(Math.random() * keys.length)];
    }

    const avatars = index[collection];
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];

    return url(collection, avatar);
}

export function url(collection: string, name: string): string {
    return `${base}/${collection}/${name}.png`;
}
