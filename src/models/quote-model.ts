import {
	type CreationOptional,
	DataTypes,
	type InferAttributes,
	type InferCreationAttributes,
	Model,
	type Sequelize,
} from "sequelize"
import type { IsoDateString, QuoteType } from "../types"

export class Quote extends Model<InferAttributes<Quote>, InferCreationAttributes<Quote>> {
	declare id: CreationOptional<number>
	declare order: CreationOptional<number>
	declare title: string
	declare url: string
	declare type: QuoteType
	declare author: string
	declare rawContent: string
	declare postedAt: IsoDateString
	declare scrapedAt: IsoDateString

	static initModel(sequelize: Sequelize) {
		Quote.init(
			{
				id: {
					type: DataTypes.INTEGER,
					autoIncrement: true,
					primaryKey: true,
				},
				order: {
					type: DataTypes.INTEGER,
					unique: true,
					field: "order",
				},
				title: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
					field: "title",
				},
				url: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
				},
				type: {
					type: DataTypes.ENUM("QUOTE_TEXT", "QUOTE_IMAGE", "BLOG"),
					allowNull: false,
				},
				author: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				rawContent: {
					type: DataTypes.TEXT,
					allowNull: true,
					field: "raw_content",
				},
				postedAt: {
					type: DataTypes.DATE,
					allowNull: false,
					field: "posted_at",
				},
				scrapedAt: {
					type: DataTypes.DATE,
					allowNull: false,
					defaultValue: DataTypes.NOW,
					field: "scraped_at",
				},
			},
			{
				sequelize,
				tableName: "quotes",
				timestamps: false,
			},
		)
	}
}
