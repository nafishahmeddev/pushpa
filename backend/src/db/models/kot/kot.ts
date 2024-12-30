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
import { Table } from "../restaurant/table";

type KotStatus = "Pending" | "Started" | "Completed" | "Delivered";

class Kot extends Model<
    InferAttributes<Kot, { omit: "table" }>,
    InferCreationAttributes<Kot, { omit: "table" }>
> {
    declare id: CreationOptional<string>;
    declare status: KotStatus;
    declare tableId: ForeignKey<Table["id"]>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare table?: NonAttribute<Table>;

    declare static associations: {
        table: Association<Kot, Table>;
    };
}

Kot.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            allowNull: false,
            defaultValue: UUIDV4,
        },
        status: {
            type: DataTypes.ENUM,
            values: ["Pending", "Started", "Completed", "Delivered"],

        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize: sequelize,
        tableName: "Kots",
    }
);

export { Kot };
