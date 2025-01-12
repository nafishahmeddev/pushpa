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

export enum InvoiceStatus {
  Paid = "Paid",
  Cancelled = "Cancelled"
}
class Invoice extends Model<
  InferAttributes<Invoice, { omit: "restaurant" | "table" }>,
  InferCreationAttributes<Invoice, { omit: "restaurant" | "table" }>
> {
  declare id: CreationOptional<string>;
  declare receiptNo: CreationOptional<number>;
  declare status: CreationOptional<InvoiceStatus> | null;
  //discount
  declare discount: CreationOptional<number>;

  declare subTotal: number;
  declare amount: number;
  declare tax: number;

  declare restaurantId: ForeignKey<Restaurant["id"]>;
  declare tableId: ForeignKey<Table["id"]>

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare restaurant?: NonAttribute<Restaurant>;
  declare table?: NonAttribute<Table>;

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
    status: {
      type: DataTypes.ENUM,
      values: Object.values(InvoiceStatus),
      defaultValue: InvoiceStatus.Paid
    },
    receiptNo: DataTypes.BIGINT,
    subTotal: DataTypes.DOUBLE,
    discount: DataTypes.INTEGER,
    amount: DataTypes.DOUBLE,
    tax: DataTypes.DOUBLE,
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
      where: { table: Invoice.tableName, restaurantId: invoice.restaurantId },
      lock: transaction.LOCK.UPDATE,
      transaction
    });
    if (!sequence) {
      sequence = await Sequence.create({
        table: Invoice.tableName, restaurantId: invoice.restaurantId,
        value: 10000
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
