import { readFileSync } from "node:fs"
import path from "node:path"
import parse from "node-html-parser"
import { describe, expect, test } from "vitest"
import { type IHtmlParser, QuoteExtractor } from "../../src/parser"
import { type Quote, QuoteType } from "../../src/types"

const quoteFilePath = path.resolve("tests/fixtures/quote_1.html")
const getHtmlContent = (): string => {
	return readFileSync(quoteFilePath, "utf8")
}

const htmlParser: IHtmlParser = parse
const EMPTY_HTML = "<body> <main></main> </body>"
const expectedQuote: Quote = {
	title: "🎲 La vie est un jeu de rôle",
	id: "",
	source_id: "",
	url: "",
	type: QuoteType.text,
	author: "Chat-nonyme",
	content_raw: "",
	postedAt: new Date("2005-03-06T23:00:07.000Z").toISOString(),
	scrapedAt: "",
}

describe("Quote parser", () => {
	describe("Titre", () => {
		test("Doit extraire le titre de la quote", () => {
			const htmlContent = getHtmlContent()
			const parser = new QuoteExtractor(htmlContent, htmlParser)
			const { title } = parser.parse()
			expect(title).toStrictEqual(expectedQuote.title)
		})
		test("Chaine vide si titre non trouvé", () => {
			const htmlContent = EMPTY_HTML
			const parser = new QuoteExtractor(htmlContent, htmlParser)
			const { title } = parser.parse()
			expect(title).toStrictEqual("")
		})
	})

	describe("Auteur", () => {
		test("Doit extraire l'auteur de la quote", () => {
			const htmlContent = getHtmlContent()
			const parser = new QuoteExtractor(htmlContent, htmlParser)
			const { author } = parser.parse()
			expect(author).toStrictEqual(expectedQuote.author)
		})
		test("Chaine vide si non trouvé", () => {
			const htmlContent = EMPTY_HTML
			const parser = new QuoteExtractor(htmlContent, htmlParser)
			const { author } = parser.parse()
			expect(author).toStrictEqual("")
		})
	})
	describe("Date de publication", () => {
		test("Doit extraire la date de publication de la quote", () => {
			const htmlContent = getHtmlContent()
			const parser = new QuoteExtractor(htmlContent, htmlParser)
			const { postedAt } = parser.parse()
			expect(postedAt).toStrictEqual(expectedQuote.postedAt)
		})
		test("Chaine vide si non trouvé", () => {
			const htmlContent = EMPTY_HTML
			const parser = new QuoteExtractor(htmlContent, htmlParser)
			const { postedAt } = parser.parse()
			expect(postedAt).toStrictEqual("")
		})
	})
	describe("ID source de la quote", () => {
		test.todo("Doit extraire l'url de la quote")
	})
})
