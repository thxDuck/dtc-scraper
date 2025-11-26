export const cleanTextSpaces = (text: string): string => text.replace(/\s+/g, " ").trim()

/**
 * Tuple [result, null] si succès, ou [null, error] si exception
 */
export type SafeResult<T> = [T, null] | [null, Error]

/**
 * Wrapper pour exécuter une fonction avec gestion automatique des erreurs.
 * @param fn - La fonction à exécuter
 * @returns SafeResult
 * @example
 *
 * ```ts
 * const [jsonData, error] = tryCatchWrapper(() => JSON.Parse("NotAJSON"))
 * // ici: "jsonData" = null, "error" = SyntaxError
 * ```
 *
 */
export function tryCatchWrapper<T>(fn: () => T): SafeResult<T> {
	try {
		const result = fn()
		return [result, null]
	} catch (error) {
		if (error instanceof Error) return [null, error]

		// Si ce n'est pas une instance de Error, on enveloppe dans un Error
		return [null, new Error(String(error))]
	}
}

/**
 * Wrapper pour exécuter une fonction asynchrone avec gestion automatique des erreurs.
 * @param fn - La fonction asynchrone à exécuter
 * @returns Promise<SafeResult<T>>
 * @example
 *
 * ```ts
 * const [data, error] = await tryCatchWrapperAsync(Quote.create({ notAProperty: "should fail" }))
 * ```
 */
export async function tryCatchWrapperAsync<T>(promise: Promise<T>): Promise<SafeResult<T>> {
	try {
		const result = await promise
		return [result, null]
	} catch (error) {
		if (error instanceof Error) return [null, error]
		return [null, new Error(String(error))]
	}
}
