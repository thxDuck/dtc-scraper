import { readFileSync } from "node:fs"
import path from "node:path"
import parse from "node-html-parser"
import { describe, expect, test } from "vitest"
import { cleanTextSpaces } from "../../src/helpers"
import { type IHtmlParser, QuoteExtractor } from "../../src/parser"
import { type Quote, QuoteType } from "../../src/types"

const quoteFilePath = path.resolve("tests/fixtures/quote_1.html")
const getHtmlContent = (): string => {
	return readFileSync(quoteFilePath, "utf8")
}

const htmlParser: IHtmlParser = parse
const EMPTY_HTML = "<body> <main></main> </body>"
const expectedContent = `<span class="decoration" style="font-weight: bold;color: RGB(242,85,106);">MickBim:</span> rha merde, demain je me lève<br>
<span class="decoration" style="font-weight: bold;color: RGB(85,242,127);">unreal-:</span> MickBim: le fais pas pour nous 😛<br>
<span class="decoration" style="font-weight: bold;color: RGB(242,85,106);">MickBim:</span> je le fais pour me nourrir.<br>
<span class="decoration" style="font-weight: bold;color: RGB(148,85,242);">barBe:</span> pas besoin de se nourrir<br>
<span class="decoration" style="font-weight: bold;color: RGB(148,85,242);">barBe:</span> suffit de tuer des monstres et de fouiller leurs corps`

const expectedQuote: Quote = {
	title: "🎲 La vie est un jeu de rôle",
	id: "",
	source_id: "",
	url: "",
	type: QuoteType.text,
	author: "Chat-nonyme",
	rawContent: cleanTextSpaces(expectedContent),
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
	describe("Contenu HTML brut", () => {
		test("Doit extraire le contenu html, nettoyé de tout espace superflu de la quote", () => {
			const htmlContent = getHtmlContent()
			const parser = new QuoteExtractor(htmlContent, htmlParser)
			const { rawContent } = parser.parse()
			expect(rawContent).toStrictEqual(expectedQuote.rawContent)
		})
		test("Chaine vide si non trouvé", () => {
			const htmlContent = EMPTY_HTML
			const parser = new QuoteExtractor(htmlContent, htmlParser)
			const { rawContent } = parser.parse()
			expect(rawContent).toStrictEqual("")
		})
	})
	describe("Type de la quote", () => {
		test("Si le contenu est présent, quote de type texte", () => {
			const htmlContent = getHtmlContent()
			const parser = new QuoteExtractor(htmlContent, htmlParser)
			const { type } = parser.parse()
			expect(type).toStrictEqual(QuoteType.text)
		})
		test("Si le contenu est vide, quote de type image", () => {
			const htmlContent = EMPTY_HTML
			const parser = new QuoteExtractor(htmlContent, htmlParser)
			const { type } = parser.parse()
			expect(type).toStrictEqual(QuoteType.image)
		})
	})
})
