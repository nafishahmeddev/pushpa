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
import { OrderItem } from "./order-item";
import { Table } from "../restaurant/table";

class Order extends Model<
    InferAttributes<Order, { omit: "restaurant" | "table"}>,
    InferCreationAttributes<Order, { omit: "restaurant" | "table" }>
> {
    declare id: CreationOptional<string>;
    declare name: string;
    declare restaurantId: ForeignKey<Restaurant["id"]>;
    declare tableId: ForeignKey<Table["id"]>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare restaurant?: NonAttribute<Restaurant>;
    declare table?: NonAttribute<Table>;
    declare items?: NonAttribute<OrderItem[]>;

    declare static associations: {
        restaurant: Association<Order, Restaurant>;
        table: Association<Order, Table>;
        items: Association<Order, OrderItem>
    };
}

Order.init(
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
        tableName: "Orders",
    }
);

export { Order };
