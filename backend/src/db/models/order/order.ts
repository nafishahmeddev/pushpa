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
import { Invoice } from "../invoice/invoice";
import { Sequence } from "../sequence";
import moment from "moment";

type OrderStatus = "Draft" | "Pending" | "Cancelled" | "Paid" | "Completed";
class Order extends Model<
    InferAttributes<Order, { omit: "restaurant" | "table" }>,
    InferCreationAttributes<Order, { omit: "restaurant" | "table" }>
> {
    declare id: CreationOptional<string>;
    declare status: CreationOptional<OrderStatus>;
    declare tokenNo: CreationOptional<number>;
    declare restaurantId: ForeignKey<Restaurant["id"]>;
    declare tableId: ForeignKey<Table["id"]>;
    declare invoiceId: ForeignKey<Invoice["id"]>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare restaurant?: NonAttribute<Restaurant>;
    declare table?: NonAttribute<Table>;
    declare invoice?: NonAttribute<Invoice>;
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
        status: {
            type: DataTypes.ENUM,
            values: ["Draft", "Pending", "Cancelled", "Paid", "Completed",],
            defaultValue: "Draft"
        },
        tokenNo: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize: sequelize,
        tableName: "Orders",
    }
);

Order.addHook("beforeCreate", (async(order: Order)=>{
    let tokenNo = 0;
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
        if (moment(order.updatedAt).isBetween(moment().startOf("D"), moment().endOf("D"))) {
            tokenNo = sequence.value + 1;
        } else {
            tokenNo = 1
        }
        await sequence.update({ value: tokenNo, }, { transaction });
    });
    order.tokenNo = tokenNo;
}))

export { Order };
