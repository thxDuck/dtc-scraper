import { DataTypes, type InferAttributes, type InferCreationAttributes, Model, type Sequelize, UUIDV4 } from "sequelize"
export class Line extends Model<InferAttributes<Line>, InferCreationAttributes<Line>> {
	declare id?: number
	declare author: string
	declare color: string
	declare message: string
	declare order: number

	static initModel(sequelize: Sequelize): typeof Line {
		return Line.init(
			{
				id: {
					type: DataTypes.UUIDV4,
					defaultValue: UUIDV4,
					primaryKey: true,
				},
				author: {
					type: DataTypes.STRING,
					allowNull: false,
					field: "author",
				},
				color: {
					type: DataTypes.STRING,
					allowNull: true,
					field: "color",
				},
				message: {
					type: DataTypes.STRING,
					allowNull: true,
					field: "message",
				},
				order: {
					type: DataTypes.STRING,
					allowNull: false,
					field: "order",
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
