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
import { Order } from "./order";


class OrderItem extends Model<
    InferAttributes<OrderItem, { omit: "order" | "product"}>,
    InferCreationAttributes<OrderItem, { omit: "order" | "product" }>
> {
    declare id: CreationOptional<string>;
    declare quantity: number;

    declare orderId: ForeignKey<Order["id"]>;
    declare productId: ForeignKey<Product["id"]>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare order?: NonAttribute<Order>;
    declare product?: NonAttribute<Product>;
}

OrderItem.init(
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
        tableName: "OrderItems",
    }
);

export { OrderItem };
