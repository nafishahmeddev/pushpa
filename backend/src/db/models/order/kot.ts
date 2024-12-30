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
import { Order } from "./order";
import { Sequence } from "../sequence";
import { Restaurant } from "../restaurant/restaurant";
import moment from "moment";

class Kot extends Model<
    InferAttributes<Kot, { omit: "order" | "restaurant" }>,
    InferCreationAttributes<Kot, { omit: "order" | "restaurant" }>
> {
    declare id: CreationOptional<string>;
    declare tokenNo: CreationOptional<number>;
    declare orderId: ForeignKey<Order["id"]>;
    declare restaurantId: ForeignKey<Restaurant["id"]>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare order?: NonAttribute<Order>;
    declare restaurant?: NonAttribute<Restaurant>;
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
        tokenNo: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize: sequelize,
        tableName: "Kots",
    }
);

Kot.addHook("beforeCreate", async (kot: Kot, options) => {
    let tokenNo = 0;
    await sequelize.transaction(async (transaction) => {
        console.log("Restaurant is::",kot.restaurantId);
        let sequence = await Sequence.findOne({
            where: { table: Kot.tableName, restaurantId: kot.restaurantId },
            lock: transaction.LOCK.UPDATE,
            transaction
        });
        if (!sequence) {
            sequence = await Sequence.create({
                table: Kot.tableName, restaurantId: kot.restaurantId,
                value: 0
            }, {
                transaction
            });
        }
        if (moment(kot.updatedAt).isBetween(moment().startOf("D"), moment().endOf("D"))) {
            tokenNo = sequence.value + 1;
        } else {
            tokenNo = 1
        }
        await sequence.update({ value: tokenNo, }, { transaction });
    });
    kot.tokenNo = tokenNo;
})

export { Kot };
