import type { HTMLElement } from "node-html-parser"
import { cleanTextSpaces } from "../helpers"
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
	private extractAuthor(): string {
		const authorElement =
			this.html.querySelector(".wp-block-post-author-name a")?.innerText ?? null
		if (!authorElement) console.warn("Parser - extractTitle : Title not found")
		return authorElement ?? ""
	}
	private extractPostDate(): string {
		const htmlElement = this.html.querySelector(
			"main time",
		) as HTMLElement | null

		const postDate = htmlElement?.getAttribute("datetime") ?? null
		if (!postDate)
			console.warn("Parser - extractPostDate : post date not found")
		return postDate ? new Date(postDate).toISOString() : ""
	}
	private extractContentRaw(): string {
		const htmlContent =
			this.html.querySelector("main .entry-content p")?.innerHTML ?? null
		return htmlContent ? cleanTextSpaces(htmlContent) : ""
	}

	public parse(): Omit<Quote, "id"> {
		const quote: Omit<Quote, "id"> = {
			source_id: "",
			title: this.extractTitle(),
			url: "",
			type: QuoteType.image,
			author: this.extractAuthor(),
			rawContent: this.extractContentRaw(),
			postedAt: this.extractPostDate(),
			scrapedAt: new Date().toISOString(),
		}
		quote.type = quote.rawContent ? QuoteType.text : QuoteType.image
		return quote
	}
}
