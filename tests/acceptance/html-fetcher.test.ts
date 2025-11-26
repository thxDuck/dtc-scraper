import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { cleanTextSpaces, tryCatchWrapperAsync } from "../../src/helpers"
import { HtmlFetcher } from "../../src/infrastructure/scraper/quote-fetcher"

// Récupérer le HTML de base avec cette commande : `curl -L "https://danstonchat.com/quote/7.html" -o quote_7.html`
const quoteFilePath = path.resolve("tests/fixtures/quote_7.html")
const mockedHtml = readFileSync(quoteFilePath, "utf8")

describe("Html fetcher", () => {
	describe("Fetching", () => {
		it("Should return a string if page exist", async () => {
			const fetcher = new HtmlFetcher()
			const [htmlContent, error] = await tryCatchWrapperAsync(fetcher.get("https://danstonchat.com/quote/7.html"))
			expect(error).toStrictEqual(null)
			expect(htmlContent).toBeTypeOf("string")

			const lengthDiff = Math.abs(cleanTextSpaces(htmlContent ?? "").length - cleanTextSpaces(mockedHtml).length)
			expect(lengthDiff).toBeLessThan(50) // Habituellement j'ai observé une fifférence de 15 caractères (Du aux informations d'auto-générationd e la page via wordpress)
		})
	})
	describe.todo("check URL", () => {
		it.todo("Should return an empty string", async () => {})
		it.todo("Should throw an error if url is not valid", async () => {})
	})
})
