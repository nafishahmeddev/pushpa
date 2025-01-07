import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
    UUIDV4,
    Association,
    NonAttribute,
} from "sequelize";
import { sequelize } from "@app/db/conn";
import { Location } from "./location";

type TableStatus = "Occupied" | "Available" | "Reserved" | "Blocked";

class Table extends Model<
    InferAttributes<Table>,
    InferCreationAttributes<Table>
> {
    declare id: CreationOptional<string>;
    declare name: string;
    declare capacity: number;
    declare status: TableStatus;
    declare locationId: ForeignKey<Location["id"]>

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare location?: NonAttribute<Location>;

    declare static associations: {
        location: Association<Location, Location>;
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
        paranoid: true,
    }
);

export { Table };
