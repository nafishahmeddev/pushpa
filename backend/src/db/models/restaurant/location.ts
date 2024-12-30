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

    declare static associations: {
        restaurant: Association<Location, Restaurant>;
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
