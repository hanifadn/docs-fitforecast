/**
 * Generates a share link by Base64-encoding a JSON summary into a URL hash.
 * Returns a fragment like `#share=BASE64DATA`.
 */
export function generateShareLink(data: Record<string, unknown>): string {
	if (typeof window === 'undefined') return '';

	const json = JSON.stringify(data);
	const encoded = btoa(unescape(encodeURIComponent(json)));
	return `${window.location.origin}${window.location.pathname}#share=${encoded}`;
}

/**
 * Parses a share link hash back into data.
 * Returns null if the hash is missing, malformed, or not a valid share link.
 */
export function parseShareLink(hash: string): Record<string, unknown> | null {
	try {
		const raw = hash.startsWith('#') ? hash.slice(1) : hash;
		const prefix = 'share=';
		if (!raw.startsWith(prefix)) return null;

		const encoded = raw.slice(prefix.length);
		const json = decodeURIComponent(escape(atob(encoded)));
		const parsed: unknown = JSON.parse(json);

		if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
			return null;
		}

		return parsed as Record<string, unknown>;
	} catch {
		return null;
	}
}

/**
 * Copies text to the clipboard using the Clipboard API.
 * Returns true on success, false on failure or when running server-side.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
	if (typeof window === 'undefined') return false;

	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
}
