import { readFileSync } from "node:fs"
import path from "node:path"
import parse from "node-html-parser"
import { describe, expect, test } from "vitest"
import { type IHtmlParser, QuoteExtractor } from "../../src/parser"

const quoteFilePath = path.resolve("tests/fixtures/quote_1.html")
const getHtmlContent = (): string => {
	return readFileSync(quoteFilePath, "utf8")
}

const htmlParser: IHtmlParser = parse

const quoteExpected = {
	title: "🎲 La vie est un jeu de rôle",
}

describe("Metadata parser", () => {
	test("Doit extraire le titre de la quote", () => {
		const htmlContent = getHtmlContent()
		const parser = new QuoteExtractor(htmlContent, htmlParser)
		const { title } = parser.parse()
		expect(title).toStrictEqual(quoteExpected.title)
	})
	test.todo("Doit extraire l'auteur de la quote")
	test.todo("Doit extraire la date de publication de la quote")
	test.todo("Doit extraire l'url de la quote")
})
