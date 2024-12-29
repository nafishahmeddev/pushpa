import {
    Association,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute,
    ForeignKey,
    UUIDV4,
} from "sequelize";
import { sequelize } from "@app/db/conn";
import { Restaurant } from "../restaurant";

type TableStatus = "Occupied" | "Available" | "Reserved" | "Blocked";

class Table extends Model<
    InferAttributes<Table, { omit: "restaurant" }>,
    InferCreationAttributes<Table, { omit: "restaurant" }>
> {
    declare id: CreationOptional<string>;
    declare name: string;
    declare capacity: number;
    declare status: TableStatus;
    declare restaurantId: ForeignKey<Restaurant["id"]>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare restaurant?: NonAttribute<Restaurant>;

    declare static associations: {
        restaurant: Association<Table, Restaurant>;
    };
}

Table.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            allowNull: false,
            defaultValue: UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        capacity: DataTypes.INTEGER,
        status: {
            type: DataTypes.ENUM,
            values: ["Occupied", "Available", "Reserved", "Blocked"],

        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize: sequelize,
        tableName: "Tables",
    }
);

export { Table };
