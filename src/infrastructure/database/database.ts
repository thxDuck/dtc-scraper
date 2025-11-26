import { Sequelize } from "sequelize"
import { Line } from "../../domain/models/line-model"
import { Quote } from "../../domain/models/quote-model"

export interface DatabaseConfig {
	host?: string
	logging?: boolean
	database: string
	username: string
	password: string
}

export class Database {
	private sequelize: Sequelize

	public readonly Quote: typeof Quote
	public readonly Line: typeof Line

	/**
	 * Méthode privée pour les tests
	 * Rappel : Le mot clé `private` limite l'accès a la compilation seulement
	 */
	private async getVersion(): Promise<string> {
		return await this.sequelize.databaseVersion()
	}

	constructor(config: DatabaseConfig) {
		this.sequelize = new Sequelize({
			host: config.host ?? "localhost",
			database: config.database,
			username: config.username,
			password: config.password,
			logging: config.logging ?? false,
			dialect: "postgres",
		})

		// Initialisation des modèles
		this.Quote = Quote.initModel(this.sequelize)
		this.Line = Line.initModel(this.sequelize)

		// Définition des relations entre les quotes et les lines
		this.setupAssociations()
		console.log(`Foonbar`)
	}
	/**
	 * 1 Quote -> n Lines
	 * n Lines -> 1 Quote
	 */
	private setupAssociations(): void {
		this.Quote.hasMany(this.Line, {
			foreignKey: "quoteId",
			as: "lines",
			onDelete: "CASCADE",
		})

		this.Line.belongsTo(this.Quote, {
			foreignKey: "quoteId",
			as: "quote",
		})
	}
	public async syncData(): Promise<void> {
		await this.sequelize.sync()
	}

	public async connect(): Promise<void> {
		await this.sequelize.authenticate()
		console.log("Database connection established successfully.")
	}
}
