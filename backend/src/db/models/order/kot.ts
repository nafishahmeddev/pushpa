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
import { Sequence } from "../sequence";
import moment from "moment";
import { Order } from "./order";

enum KotStatus {
    Pending = "Pending",
    Cancelled = "Cancelled",
    Preparing = "Preparing",
    Completed = "Completed",
    Delivered = "Delivered",
}
class Kot extends Model<
    InferAttributes<Kot, { omit: "order" }>,
    InferCreationAttributes<Kot, { omit: "order" }>
> {
    declare id: CreationOptional<string>;
    declare status: CreationOptional<KotStatus>;
    declare tokenNo: CreationOptional<number>;
    declare orderId: ForeignKey<Order["id"]>;
    declare restaurantId: ForeignKey<Restaurant["id"]>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare order?: NonAttribute<Order>;
    declare restaurant?: NonAttribute<Restaurant>;
    declare items?: NonAttribute<OrderItem[]>;

    declare static associations: {
        restaurant: Association<Kot, Restaurant>;
        table: Association<Kot, Table>;
        items: Association<Kot, OrderItem>
    };
}

Kot.init(
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
            values: Object.values(KotStatus),
            defaultValue: KotStatus.Pending
        },
        tokenNo: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize: sequelize,
        tableName: "Kot",
    }
);

Kot.addHook("beforeCreate", (async (order: Kot) => {
    let tokenNo = 0;
    await sequelize.transaction(async (transaction) => {
        let sequence = await Sequence.findOne({
            where: { table: Kot.tableName, restaurantId: order.restaurantId },
            lock: transaction.LOCK.UPDATE,
            transaction
        });
        if (!sequence) {
            sequence = await Sequence.create({
                table: Kot.tableName, restaurantId: order.restaurantId,
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

export { Kot };
