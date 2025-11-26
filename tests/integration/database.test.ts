import { describe, expect, it } from "vitest"
import { tryCatchWrapper } from "../../src/helpers"
import { Database, type DatabaseConfig } from "../../src/infrastructure/database/database"

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

			await database.syncData({ force: true })

			// @ts-expect-error <Private field access>
			const pgVersion = await database.getVersion()
			const major = pgVersion.split(".")[0]
			expect(major).toStrictEqual("18")
		})
		it("should contains line and quote table", async () => {
			const [database, error] = tryCatchWrapper(() => new Database(VALID_DATABASE_CONFIG))
			expect(error, "La connexion a la base de données a échouée").toBeNull()
			if (!database) throw new Error()

			await database.syncData({ force: true })

			const quotes = await database.Quote.count()
			const lines = await database.Line.count()
			expect(quotes).toStrictEqual(0)
			expect(lines).toStrictEqual(0)
		})
	})
})
