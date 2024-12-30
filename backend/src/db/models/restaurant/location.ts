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
import { Restaurant } from "./restaurant";
import { Table } from "./table";

class Location extends Model<
    InferAttributes<Location, { omit: "restaurant" }>,
    InferCreationAttributes<Location, { omit: "restaurant" }>
> {
    declare id: CreationOptional<string>;
    declare name: string;
    declare restaurantId: ForeignKey<Restaurant["id"]>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare restaurant?: NonAttribute<Restaurant>;
    declare tables?: NonAttribute<Table[]>;

    declare static associations: {
        restaurant: Association<Location, Restaurant>;
        tables: Association<Location, Table>;
    };
}

Location.init(
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
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize: sequelize,
        tableName: "Locations",
    }
);

export { Location };
