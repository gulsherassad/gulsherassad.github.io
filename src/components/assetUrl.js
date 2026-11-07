/** Resolves a public/ path (e.g. 'projects/epl-1.webp') against Vite's base. */
export const assetUrl = (src) => `${import.meta.env.BASE_URL}${src}`;
