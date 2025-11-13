export enum QuoteType {
	text = "TEXT",
	image = "IMAGE",
}

/**
 * Date au format ISO
 */
export type IsoDateString = string

export interface Quote {
	id: string
	source_id: string
	title: string
	url: string
	type: QuoteType
	author: string
	content_raw: string
	posted_at: IsoDateString
	scraped_at: IsoDateString
}
