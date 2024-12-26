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
import { sequelize } from "../../conn";
import { Product } from "../product/product";
import { Cart } from "./cart";


class CartItem extends Model<
    InferAttributes<CartItem, { omit: "cart" | "product"}>,
    InferCreationAttributes<CartItem, { omit: "cart" | "product" }>
> {
    declare id: CreationOptional<string>;
    declare quantity: number;

    declare cartId: ForeignKey<Cart["id"]>;
    declare productId: ForeignKey<Product["id"]>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare cart?: NonAttribute<Cart>;
    declare product?: NonAttribute<Product>;

    declare static associations: {
        table: Association<CartItem, Cart>;
        product: Association<CartItem, Product>;
    };
}

CartItem.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            allowNull: false,
            defaultValue: UUIDV4,
        },
        quantity: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "CartItems",
    }
);

export { CartItem };
