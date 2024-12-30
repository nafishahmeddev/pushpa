import {
  Association,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  UUIDV4,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../../conn";
import { Restaurant } from "../restaurant/restaurant";
import { Sequence } from "../sequence";
import { Table } from "../restaurant/table";

class Order extends Model<
  InferAttributes<Order, { omit: "restaurant" | "table" }>,
  InferCreationAttributes<Order, { omit: "restaurant" | "table" }>
> {
  declare id: CreationOptional<string>;
  declare receiptNo: CreationOptional<number>;
  declare amount: number;
  declare cgst: number;
  declare sgst: number;
  declare restaurantId: ForeignKey<Restaurant["id"]>;
  declare tableId: ForeignKey<Table["id"]>

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare restaurant?: NonAttribute<Restaurant>;
  declare table?: NonAttribute<Table>;

  declare static associations: {
    restaurant: Association<Order, Restaurant>
    table: Association<Order, Table>
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
    receiptNo: DataTypes.BIGINT,
    amount: DataTypes.DOUBLE,
    cgst: DataTypes.DOUBLE,
    sgst: DataTypes.DOUBLE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "Orders",
  }
);
Order.addHook("beforeCreate", async function (order: Order, options) {
  let receiptNo = 0;
  await sequelize.transaction(async (transaction) => {
    let sequence = await Sequence.findOne({
      where: { table: "Orders", restaurantId: order.restaurantId },
      lock: transaction.LOCK.UPDATE,
      transaction
    });
    if (!sequence) {
      sequence = await Sequence.create({
        table: "Orders", restaurantId: order.restaurantId,
        value: 768789
      }, {
        transaction
      });
    }
    receiptNo = sequence.value + 1;
    await sequence.update({ value: receiptNo, }, { transaction });
  });
  order.receiptNo = receiptNo;
});

export { Order };
