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
	rawContent: string
	postedAt: IsoDateString
	scrapedAt: IsoDateString
}

export interface QuoteLine {
	id?: number
	author: string
	color: string
	message: string
	order: number
}
