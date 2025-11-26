import { readFileSync } from "node:fs"
import path from "node:path"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { tryCatchWrapperAsync } from "../../src/helpers"
import { HtmlFetcher } from "../../src/infrastructure/scraper/quote-fetcher"

// Récupérer le HTML de base avec cette commande : `curl -L "https://danstonchat.com/quote/7.html" -o quote_7.html`
const quoteFilePath = path.resolve("tests/fixtures/quote_7.html")
const mockedHtml = readFileSync(quoteFilePath, "utf8")

describe("Html fetcher", () => {
	beforeEach(() => {
		vi.restoreAllMocks()
	})
	describe("Fetching", () => {
		it("Should return a string if page exist", async () => {
			vi.spyOn(globalThis, "fetch").mockResolvedValue({
				ok: true,
				status: 200,
				text: () => Promise.resolve(mockedHtml),
			} as Response)

			const fetcher = new HtmlFetcher()
			const [htmlContent, error] = await tryCatchWrapperAsync(fetcher.get("https://danstonchat.com/quote/7.html"))
			expect(error).toStrictEqual(null)
			expect(htmlContent).toBeTypeOf("string")
			expect(htmlContent).toStrictEqual(mockedHtml)
		})
		it("Should throw if fetch rejects (network error)", async () => {
			vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network unreachable"))

			const fetcher = new HtmlFetcher()
			const [htmlContent, error] = await tryCatchWrapperAsync(fetcher.get("https://danstonchat.com/quote/7.html"))
			expect(error).toBeInstanceOf(Error)
			expect(htmlContent).toStrictEqual(null)
		})
		it("should throw if response.text() fails", async () => {
			vi.spyOn(globalThis, "fetch").mockResolvedValue({
				ok: true,
				status: 200,
				text: vi.fn().mockRejectedValue("Fail"),
			} as unknown as Response)

			const fetcher = new HtmlFetcher()
			const [htmlContent, error] = await tryCatchWrapperAsync(fetcher.get("https://danstonchat.com/quote/7.html"))
			expect(error).toBeInstanceOf(Error)
			expect(htmlContent).toStrictEqual(null)
		})
	})
	describe.todo("check URL", () => {
		it.todo("Should return an empty string", async () => {})
		it.todo("Should throw an error if url is not valid", async () => {})
	})
})
