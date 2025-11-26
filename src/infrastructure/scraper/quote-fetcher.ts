import { tryCatchWrapperAsync } from "../../helpers"

export interface IHtmlFetcher {
	get(url: string): Promise<string | null>
}

/**
 * Generation de headers pour simuler un navigateur
 */
const BASIC_HEADERS = {
	"User-Agent":
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
	Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
	"Accept-Language": "fr-FR,fr;q=0.8,en-US;q=0.5,en;q=0.3",
	"Cache-Control": "no-cache",
	Pragma: "no-cache",
	Connection: "keep-alive",
}

export class HtmlFetcher implements IHtmlFetcher {
	async get(url: string): Promise<string | null> {
		const [response, error] = await tryCatchWrapperAsync(
			fetch(url, {
				method: "GET",
				redirect: "follow",
				headers: BASIC_HEADERS,
			}),
		)
		if (error || !response) throw error ? error : new Error(`Fail to fetch url: ${response}`)
		return await response.text()
	}
}
