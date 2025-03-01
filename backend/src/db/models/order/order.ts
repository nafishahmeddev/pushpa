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
import { sequelize } from "@app/db/conn";
import { Restaurant } from "../restaurant/restaurant";
import { OrderItem } from "./order-item";
import { Table } from "../restaurant/table";
import { Invoice } from "../invoice/invoice";
import { Sequence } from "../sequence";
import { Kot } from "./kot";
import { User } from "../user/user";

export enum OrderStatus {
    Draft = "Draft",
    Ongoing = "Ongoing",
    Cancelled = "Cancelled",
    Paid = "Paid",
    Completed = "Completed"
}

export enum OrderType {
    Takeaway = "Takeaway",
    DineIn = "Dine-In",
}
class Order extends Model<
    InferAttributes<Order, { omit: "restaurant" | "table" }>,
    InferCreationAttributes<Order, { omit: "restaurant" | "table" }>
> {
    declare id: CreationOptional<string>;
    declare orderNo: CreationOptional<number>;
    declare status: CreationOptional<OrderStatus>;
    declare type: CreationOptional<OrderType>;
    declare discount:  CreationOptional<number>;

    declare restaurantId: ForeignKey<Restaurant["id"]>;
    declare tableId: ForeignKey<Table["id"]>;
    declare invoiceId: ForeignKey<Invoice["id"]>;
    declare userId: ForeignKey<User["id"]>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare restaurant?: NonAttribute<Restaurant>;
    declare user?: NonAttribute<User>;
    declare table?: NonAttribute<Table>;
    declare invoice?: NonAttribute<Invoice>;
    declare items?: NonAttribute<OrderItem[]>;
    declare kotList?: NonAttribute<Kot[]>;
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
        orderNo: DataTypes.BIGINT,
        status: {
            type: DataTypes.ENUM,
            values: Object.values(OrderStatus),
            defaultValue: OrderStatus.Draft
        },
        type: {
            type: DataTypes.ENUM,
            values: Object.values(OrderType),
            defaultValue: OrderType.Takeaway
        },
        discount: DataTypes.DOUBLE,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize: sequelize,
        tableName: "Orders",
    }
);

Order.addHook("beforeCreate", (async (order: Order) => {
    let orderNo = 0;
    await sequelize.transaction(async (transaction) => {
        let sequence = await Sequence.findOne({
            where: { table: Order.tableName, restaurantId: order.restaurantId },
            lock: transaction.LOCK.UPDATE,
            transaction
        });
        if (!sequence) {
            sequence = await Sequence.create({
                table: Order.tableName, restaurantId: order.restaurantId,
                value: 0
            }, {
                transaction
            });
        }
        orderNo = sequence.value + 1;
        await sequence.update({ value: orderNo, }, { transaction });
    });
    order.orderNo = orderNo;
}))

export { Order };
