import type { QuoteType } from "../../../domain/models/quote-model"
import type { IsoDateString } from "../../../types"

export interface ScrapedQuote {
	id?: number
	title: string
	url: string
	nextUrl?: string
	type: QuoteType
	author: string
	rawContent: string
	postedAt: IsoDateString
	scrapedAt: IsoDateString
}

export interface ScrapedQuoteLine {
	id?: number
	author: string
	color: string
	message: string
	order: number
}
