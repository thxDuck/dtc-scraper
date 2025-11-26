import { HTMLElement } from "node-html-parser"
import { cleanTextSpaces } from "../../helpers"
import type { ScrapedQuote, ScrapedQuoteLine } from "./dto/scraped-quote.dto"

export interface IQuoteExtractor {
	parseMetadata(): ScrapedQuote
	parseLines(): ScrapedQuoteLine[]
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
		const authorElement = this.html.querySelector(".wp-block-post-author-name a")?.innerText ?? null
		if (!authorElement) console.warn("Parser - extractAuthor : Author not found")
		return authorElement ?? ""
	}
	private extractPostDate(): string {
		const htmlElement = this.html.querySelector("main time") as HTMLElement | null

		const postDate = htmlElement?.getAttribute("datetime") ?? null
		if (!postDate) console.warn("Parser - extractPostDate : Post date not found")
		return postDate ? new Date(postDate).toISOString() : ""
	}
	private extractContentRaw(): string {
		const htmlContent = this.htmlContent?.innerHTML ?? null
		if (!htmlContent) console.warn("Parser - extractContentRaw : content not found")
		return htmlContent ? cleanTextSpaces(htmlContent) : ""
	}
	get htmlContent(): HTMLElement | null {
		return this.html.querySelector("main .entry-content p") ?? null
	}

	public parseMetadata(): ScrapedQuote {
		const quote: ScrapedQuote = {
			title: this.extractTitle(),
			url: "",
			type: "QUOTE_IMAGE",
			author: this.extractAuthor(),
			rawContent: this.extractContentRaw(),
			postedAt: this.extractPostDate(),
			scrapedAt: new Date().toISOString(),
		}
		quote.type = quote.rawContent ? "QUOTE_TEXT" : "QUOTE_IMAGE"
		return quote
	}

	public parseLines(): ScrapedQuoteLine[] {
		const p = this.htmlContent

		const lines: ScrapedQuoteLine[] = []
		if (!p) return lines

		// Chaque "bloc" de ligne est un span + texte suivant + br
		// On récupère les enfants de <p> en conservant l'ordre
		const children = p.childNodes

		let currentOrder = 0

		for (let i = 0; i < children.length; i++) {
			const node = children[i]

			// On ne traite que les <span>
			if (node instanceof HTMLElement && node.tagName === "SPAN") {
				const span = node

				const rawAuthor = span.text.trim()
				const author = rawAuthor.replace(/:$/, "") // enlever le ":" final
				const color = extractColor(span.getAttribute("style") ?? "") ?? ""

				// Le message est dans le texte juste après le <span>
				let message = ""
				const next = children[i + 1]

				if (typeof next === "string") {
					message = (next as string)?.trim()
				} else if (next?.nodeType === 3) {
					// node-html-parser "text node"
					message = (next.rawText ?? "").trim()
				}

				lines.push({
					author,
					color,
					message,
					order: currentOrder++,
				})
			}
		}

		return lines
	}
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */
function extractColor(style: string): string | null {
	const match = style.match(/color:\s*([^;]+)/i)
	if (!match?.[1]) return null
	return match ? match[1].trim() : null
}
