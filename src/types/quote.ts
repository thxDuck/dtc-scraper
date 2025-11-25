export type QuoteType = "QUOTE_TEXT" | "QUOTE_IMAGE" | "BLOG"


/**
 * Date au format ISO
 */
export type IsoDateString = string

export interface Quote {
	id: number
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
