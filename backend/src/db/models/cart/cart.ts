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
import { Restaurant } from "../restaurant/restaurant";
import { CartItem } from "./cart-item";
import { Table } from "../restaurant/table";

class Cart extends Model<
    InferAttributes<Cart, { omit: "restaurant" | "table"}>,
    InferCreationAttributes<Cart, { omit: "restaurant" | "table" }>
> {
    declare id: CreationOptional<string>;
    declare name: string;
    declare restaurantId: ForeignKey<Restaurant["id"]>;
    declare tableId: ForeignKey<Table["id"]>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare restaurant?: NonAttribute<Restaurant>;
    declare table?: NonAttribute<Table>;
    declare items?: NonAttribute<CartItem[]>;

    declare static associations: {
        restaurant: Association<Cart, Restaurant>;
        table: Association<Cart, Table>;
        items: Association<Cart, CartItem>
    };
}

Cart.init(
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
        tableName: "Carts",
    }
);

export { Cart };
