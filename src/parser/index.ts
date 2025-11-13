import type { HTMLElement } from "node-html-parser"
import { type Quote, QuoteType } from "../types"

export interface IQuoteExtractor {
	parse(): Omit<Quote, "id">
}

export interface IHtmlParser {
	parse(html: string): HTMLElement
}
export class QuoteExtractor implements IQuoteExtractor {
	private html: HTMLElement
	private htmlParser: IHtmlParser
	constructor(htmlContent: string, htmlParser: IHtmlParser) {
		this.htmlParser = htmlParser
		this.html = this.htmlParser.parse(htmlContent)
	}

	private extractTitle(): string {
		const titleElement = this.html.querySelector("main h1")?.innerText ?? null
		if (!titleElement) console.warn("Parser - extractTitle : Title not found")
		return titleElement ?? ""
	}
	public parse(): Omit<Quote, "id"> {
		return {
			source_id: "",
			title: this.extractTitle(),
			url: "",
			type: QuoteType.text,
			author: "",
			content_raw: "",
			posted_at: new Date().toISOString(),
			scraped_at: new Date().toISOString(),
		}
	}
}
