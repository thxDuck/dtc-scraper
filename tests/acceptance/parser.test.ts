import { readFileSync } from "node:fs"
import path from "node:path"
import parse from "node-html-parser"
import { describe, expect, test } from "vitest"
import { cleanTextSpaces } from "../../src/helpers"
import type { ScrapedQuote, ScrapedQuoteLine } from "../../src/infrastructure/scraper/dto/scraped-quote.dto"
import { type IHtmlParser, QuoteExtractor } from "../../src/infrastructure/scraper/quote-parser"

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

const expectedQuote: ScrapedQuote = {
	title: "🎲 La vie est un jeu de rôle",
	id: 7,
	url: "",
	type: "QUOTE_TEXT",
	author: "Chat-nonyme",
	rawContent: cleanTextSpaces(expectedContent),
	postedAt: new Date("2005-03-06T23:00:07.000Z").toISOString(),
	scrapedAt: "",
}

const expectedLines: ScrapedQuoteLine[] = [
	{
		author: "MickBim",
		color: "RGB(242,85,106)",
		message: "rha merde, demain je me lève",
		order: 0,
	},
	{
		author: "unreal-",
		color: "RGB(85,242,127)",
		message: "MickBim: le fais pas pour nous 😛",
		order: 1,
	},
	{
		author: "MickBim",
		color: "RGB(242,85,106)",
		message: "je le fais pour me nourrir.",
		order: 2,
	},
	{
		author: "barBe",
		color: "RGB(148,85,242)",
		message: "pas besoin de se nourrir",
		order: 3,
	},
	{
		author: "barBe",
		color: "RGB(148,85,242)",
		message: "suffit de tuer des monstres et de fouiller leurs corps",
		order: 4,
	},
]

describe("Quote parser", () => {
	describe("Metadata de la quote", () => {
		describe("Titre", () => {
			test("Doit extraire le titre de la quote", () => {
				const htmlContent = getHtmlContent()
				const parser = new QuoteExtractor(htmlContent, htmlParser)
				const { title } = parser.parseMetadata()
				expect(title).toStrictEqual(expectedQuote.title)
			})
			test("Chaine vide si titre non trouvé", () => {
				const htmlContent = EMPTY_HTML
				const parser = new QuoteExtractor(htmlContent, htmlParser)
				const { title } = parser.parseMetadata()
				expect(title).toStrictEqual("")
			})
		})
		describe("Auteur", () => {
			test("Doit extraire l'auteur de la quote", () => {
				const htmlContent = getHtmlContent()
				const parser = new QuoteExtractor(htmlContent, htmlParser)
				const { author } = parser.parseMetadata()
				expect(author).toStrictEqual(expectedQuote.author)
			})
			test("Chaine vide si non trouvé", () => {
				const htmlContent = EMPTY_HTML
				const parser = new QuoteExtractor(htmlContent, htmlParser)
				const { author } = parser.parseMetadata()
				expect(author).toStrictEqual("")
			})
		})
		describe("Date de publication", () => {
			test("Doit extraire la date de publication de la quote", () => {
				const htmlContent = getHtmlContent()
				const parser = new QuoteExtractor(htmlContent, htmlParser)
				const { postedAt } = parser.parseMetadata()
				expect(postedAt).toStrictEqual(expectedQuote.postedAt)
			})
			test("Chaine vide si non trouvé", () => {
				const htmlContent = EMPTY_HTML
				const parser = new QuoteExtractor(htmlContent, htmlParser)
				const { postedAt } = parser.parseMetadata()
				expect(postedAt).toStrictEqual("")
			})
		})
		describe("Contenu HTML brut", () => {
			test("Doit extraire le contenu html, nettoyé de tout espace superflu de la quote", () => {
				const htmlContent = getHtmlContent()
				const parser = new QuoteExtractor(htmlContent, htmlParser)
				const { rawContent } = parser.parseMetadata()
				expect(rawContent).toStrictEqual(expectedQuote.rawContent)
			})
			test("Chaine vide si non trouvé", () => {
				const htmlContent = EMPTY_HTML
				const parser = new QuoteExtractor(htmlContent, htmlParser)
				const { rawContent } = parser.parseMetadata()
				expect(rawContent).toStrictEqual("")
			})
		})
		describe("Type de la quote", () => {
			test("Si le contenu est présent, quote de type texte", () => {
				const htmlContent = getHtmlContent()
				const parser = new QuoteExtractor(htmlContent, htmlParser)
				const { type } = parser.parseMetadata()
				expect(type).toStrictEqual("QUOTE_TEXT")
			})
			test("Si le contenu est vide, quote de type image", () => {
				const htmlContent = EMPTY_HTML
				const parser = new QuoteExtractor(htmlContent, htmlParser)
				const { type } = parser.parseMetadata()
				expect(type).toStrictEqual("QUOTE_IMAGE")
			})
		})
	})

	describe("Lignes de discution de la quote", () => {
		test("Doit extraire une ligne valide", () => {
			const htmlContent = getHtmlContent()
			const parser = new QuoteExtractor(htmlContent, htmlParser)
			parser.parseMetadata()
			const lines = parser.parseLines()
			expect(lines.length).toBeGreaterThan(0)
			expect(lines[0]).toMatchObject(expectedLines[0] as object)
		})
		test("Doit extraire toute les lignes, dans le bon ordre", () => {
			const htmlContent = getHtmlContent()
			const parser = new QuoteExtractor(htmlContent, htmlParser)
			parser.parseMetadata()
			const lines = parser.parseLines()

			expect(lines).toMatchObject(expectedLines)
		})
		test("Doit retourner un tableau vide si le contenu n'est pas trouvé", () => {
			const htmlContent = EMPTY_HTML
			const parser = new QuoteExtractor(htmlContent, htmlParser)
			parser.parseMetadata()
			const lines = parser.parseLines()

			expect(lines).toMatchObject([])
		})
	})
})
