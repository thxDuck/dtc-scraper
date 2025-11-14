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

	public parse(): Omit<Quote, "id"> {
		return {
			source_id: "",
			title: this.extractTitle(),
			url: "",
			type: QuoteType.text,
			author: this.extractAuthor(),
			content_raw: "",
			postedAt: this.extractPostDate(),
			scrapedAt: new Date(0).toISOString(),
		}
	}
}
