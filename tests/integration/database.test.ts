import { describe, expect, it } from "vitest"
import { Database, type DatabaseConfig } from "../../src/infrastructure/database/database"

/**
 * Wrapper pour exécuter une fonction avec gestion automatique des erreurs.
 * @param fn - La fonction à exécuter
 * @returns Un tuple [result, null] si succès, ou [null, error] si exception
 */
function tryCatchWrapper<T>(fn: () => T): [T, null] | [null, Error] {
	try {
		const result = fn()
		return [result, null]
	} catch (error) {
		if (error instanceof Error) {
			return [null, error]
		}
		// Si ce n'est pas une instance de Error, on enveloppe dans un Error
		return [null, new Error(String(error))]
	}
}

const VALID_DATABASE_CONFIG: DatabaseConfig = {
	host: "localhost",
	username: "admin",
	password: "localhost-p4ssw0rd",
	database: "quote-database",
}

describe("database", () => {
	describe("Database connection", () => {
		it("should connect with a valid configuration", async () => {
			const [database, error] = tryCatchWrapper(() => new Database(VALID_DATABASE_CONFIG))
			expect(error, "La connexion a la base de données a échouée").toBeNull()
			if (!database) throw new Error()
		})
		it("Postgres should be major version 18", async () => {
			const [database, error] = tryCatchWrapper(() => new Database(VALID_DATABASE_CONFIG))
			expect(error, "La connexion a la base de données a échouée").toBeNull()
			if (!database) throw new Error()

			await database.syncData()
			console.log(`Database synchronized !`)

			// @ts-expect-error <Private field access>
			const pgVersion = await database.getVersion()
			const major = pgVersion.split(".")[0]
			expect(major).toStrictEqual("18")
		})
		it("should contains line and quote table", async () => {
			const [database, error] = tryCatchWrapper(() => new Database(VALID_DATABASE_CONFIG))
			expect(error, "La connexion a la base de données a échouée").toBeNull()
			if (!database) throw new Error()

			await database.syncData()
			console.log(`Database synchronized !`)

			const quotes = await database.Quote.count()
			const lines = await database.Line.count()
			expect(quotes).toStrictEqual(0)
			expect(lines).toStrictEqual(0)
		})
	})
})
