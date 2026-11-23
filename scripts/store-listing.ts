/** Reads a `docs/store/<lang>/listing.md`, so its texts can be checked against Play's limits (LG-20). */
export interface ListingBlock {
  text: string
  stated: number
  limit: number
  // in Unicode characters, as Play counts them
  length: number
}

export interface Listing {
  title?: ListingBlock
  short?: ListingBlock
  full?: ListingBlock
  releaseNotes?: ListingBlock
}

const BLOCK_KEYS: Record<string, keyof Listing> = {
  Title: 'title',
  'Short description': 'short',
  'Full description': 'full',
  'Release notes': 'releaseNotes',
}

const BLOCK = /^## (Title|Short description|Full description|Release notes) \((\d+) \/ (\d+)\)\n[\s\S]*?```text\n([\s\S]*?)\n```/gm

export function parseListing(markdown: string): Listing {
  const listing: Listing = {}
  for (const [, heading, stated, limit, text] of markdown.matchAll(BLOCK)) {
    const key = BLOCK_KEYS[heading as string]
    if (!key) continue
    listing[key] = {
      text: text as string,
      stated: Number(stated),
      limit: Number(limit),
      length: [...(text as string)].length,
    }
  }
  return listing
}
