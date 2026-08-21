// ── Provider identity for analytics ─────────────────────────────────────────
// Every custom OpenAI-compatible endpoint shares the platform id 'custom'
// (see services/custom-endpoint.ts), so any analytics view that groups by
// `platform` alone collapses every custom relay into a single "custom" row and
// the operator can no longer tell which endpoint did what (#889).
//
// The canonical identity of a custom endpoint is the serving key's `base_url`
// — custom-endpoint.ts already groups its credential pool by base_url, and the
// router treats every key sharing a base_url as the same endpoint. Grouping by
// base_url therefore splits one endpoint's pooled keys back into a single row
// while keeping distinct endpoints apart.
//
// These helpers produce the stable id + display name the analytics endpoints
// attach to each row. They are pure so they can be unit-tested without a DB.

/**
 * The host (and port) of a custom endpoint's base_url — the short identifier
 * that actually tells two endpoints apart. Mirrors the default label
 * convention in services/custom-endpoint.ts (`new URL(baseUrl).host`) but
 * returns null instead of a literal when the URL is unparseable, so callers
 * can fall back to the generic 'custom' id rather than a fake host.
 */
export function endpointHost(baseUrl: string | null | undefined): string | null {
  if (!baseUrl) return null;
  try {
    return new URL(baseUrl).host || null;
  } catch {
    return null;
  }
}

/**
 * The stable provider id for an analytics row. Non-custom platforms keep their
 * bare slug ('groq', 'openai', …) so existing filters and the platform dot
 * coloring are untouched. Custom endpoints get 'custom:<base_url>' so two
 * relays never collide; a custom request whose key is gone (or never had a
 * base_url) falls back to the plain 'custom' id, preserving the pre-fix shape.
 */
export function providerIdFor(platform: string, baseUrl: string | null | undefined): string {
  if (platform !== 'custom') return platform;
  return baseUrl ? `custom:${baseUrl}` : 'custom';
}

/**
 * The display name for an analytics row: the endpoint host for custom rows
 * (what the operator actually reads), the platform slug otherwise. Null host
 * falls back to the platform so there is always something to render.
 */
export function providerDisplayName(
  platform: string,
  baseUrl: string | null | undefined,
): string {
  if (platform === 'custom') {
    return endpointHost(baseUrl) ?? platform;
  }
  return platform;
}
