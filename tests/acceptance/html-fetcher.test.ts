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
	describe("check URL", () => {
		describe("Can fetch and parse valid url", () => {
			it.each([
				{ url: "https://danstonchat.com", toBe: "https://danstonchat.com/", testCase: "Valid email" },
				{
					url: "https://danstonchat.com/quote/🍟-pompe-a-frite.html",
					toBe: "https://danstonchat.com/quote/%F0%9F%8D%9F-pompe-a-frite.html",
					testCase: "Url with emoji",
				},
				{
					url: "https://danstonchat.com/quote/%f0%9f%8d%9f-pompe-a-frite.html",
					toBe: "https://danstonchat.com/quote/%f0%9f%8d%9f-pompe-a-frite.html",
					testCase: "Url with encoded emoji",
				},
				{
					url: "https://danstonchat.com/quote/80.html",
					toBe: "https://danstonchat.com/quote/80.html",
					testCase: "Valid email",
				},
			])("$testCase", async ({ url, toBe }) => {
				const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
					ok: true,
					status: 200,
					text: vi.fn().mockResolvedValue("<body></body>"),
				} as unknown as Response)

				const fetcher = new HtmlFetcher()
				const [_, error] = await tryCatchWrapperAsync(fetcher.get(url))

				expect(error).toStrictEqual(null)
				const firstArgumentFetchCall = fetchSpy.mock.calls[0]?.[0] ?? "NOT_VALID"
				expect(fetchSpy).toHaveBeenCalledOnce()
				expect(firstArgumentFetchCall).toStrictEqual(toBe)
			})
		})
		describe("throw an error if url is invalid", () => {
			it.each([
				{ url: "danstonchat.com", testCase: "Only domain" },
				{ url: "http://danstonchat.com/quote/80.html", testCase: "Unsafe Http" },
				{ url: "http://localhost:3000/test", testCase: "Only domain" },
				{ url: "https", testCase: "only protocol" },
				{ url: "https://", testCase: "only protocol" },
				{ url: "ftp://example.com", testCase: "Protocol ftp" },
				{ url: "ht!tps://bad", testCase: "Only domain" },
				{ url: "url is a lie", testCase: "Simple string" },
				{ url: "", testCase: "Empty string" },
				{ url: 55, testCase: "A number ? Seriousely ?" },
				{ url: 55n, testCase: "A big int..." },
				{ url: { url: "https://danstonchat.com" }, testCase: "An object" },
			])("$testCase", async ({ url }) => {
				const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
					ok: true,
					status: 200,
					text: vi.fn().mockResolvedValue("<body></body>"),
				} as unknown as Response)

				const fetcher = new HtmlFetcher()
				const [_, error] = await tryCatchWrapperAsync(fetcher.get(url as string))

				expect(error, `This url shouldn't be valid ! (url=${url})`).toBeInstanceOf(Error)
				expect(fetchSpy).not.toHaveBeenCalledOnce()
			})
		})
	})
})
