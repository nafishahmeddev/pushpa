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

class Invoice extends Model<
  InferAttributes<Invoice, { omit: "restaurant" | "table" }>,
  InferCreationAttributes<Invoice, { omit: "restaurant" | "table" }>
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
    restaurant: Association<Invoice, Restaurant>
    table: Association<Invoice, Table>
  };
}

Invoice.init(
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
    tableName: "Invoices",
  }
);
Invoice.addHook("beforeCreate", async function (invoice: Invoice, options) {
  let receiptNo = 0;
  await sequelize.transaction(async (transaction) => {
    let sequence = await Sequence.findOne({
      where: { table: "Invoices", restaurantId: invoice.restaurantId },
      lock: transaction.LOCK.UPDATE,
      transaction
    });
    if (!sequence) {
      sequence = await Sequence.create({
        table: "Invoices", restaurantId: invoice.restaurantId,
        value: 768789
      }, {
        transaction
      });
    }
    receiptNo = sequence.value + 1;
    await sequence.update({ value: receiptNo, }, { transaction });
  });
  invoice.receiptNo = receiptNo;
});

export { Invoice };
