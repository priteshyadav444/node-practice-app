const cache = new Map();

export const set = (key, value, ttl = 30000) => {
    const expires = Date.now() + ttl;
    cache.set(key, { value, expires });
};

export const get = (key) => {
    const entry = cache.get(key);
    if (!entry) return null;
    if (entry.expires && entry.expires < Date.now()) {
        cache.delete(key);
        return null;
    }
    return entry.value;
};

export const del = (key) => {
    const result = cache.delete(key)
    return result;
};

export const delByPrefix = (prefix) => {
    for (const k of Array.from(cache.keys())) {
        if (k.startsWith(prefix)) cache.delete(k);
    }
};

export const clear = () => cache.clear();

export default { set, get, del, delByPrefix, clear };
