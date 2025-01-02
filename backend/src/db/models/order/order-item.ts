import {
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
import { Kot } from "./kot";

export enum OrderItemStatus {
    Preparing = "Preparing",
    Prepared = "Prepared",
    Delivered = "Delivered",
    Cancelled = "Cancelled"
}

class OrderItem extends Model<
    InferAttributes<OrderItem, { omit: "order" | "product" | "kot" }>,
    InferCreationAttributes<OrderItem, { omit: "order" | "product" | "kot" }>
> {
    declare id: CreationOptional<string>;
    declare quantity: number;
    declare status: CreationOptional<OrderItemStatus>;

    declare orderId: ForeignKey<Order["id"]>;
    declare productId: ForeignKey<Product["id"]>;
    declare kotId: CreationOptional<ForeignKey<Kot["id"]> | null>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare order?: NonAttribute<Order>;
    declare product?: NonAttribute<Product>;
    declare kot?: NonAttribute<Kot>;
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
        status: {
            type: DataTypes.ENUM,
            values: Object.values(OrderItemStatus),
            defaultValue: OrderItemStatus.Preparing
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "OrderItems",
    }
);

export { OrderItem };
