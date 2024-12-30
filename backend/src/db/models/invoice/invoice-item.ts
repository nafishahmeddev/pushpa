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
import { Table } from "../restaurant/table";
import { Invoice } from "./invoice";

class InvoiceItem extends Model<
  InferAttributes<InvoiceItem, { omit: "invoice" }>,
  InferCreationAttributes<InvoiceItem, { omit: "invoice" }>
> {
  declare id: CreationOptional<string>;
  declare quantity: number;
  declare name: string;
  declare price: number;
  declare amount: number;
  declare tax: number;

  declare invoiceId: ForeignKey<Invoice["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;


  declare invoice?: NonAttribute<Table>;

  declare static associations: {
    order: Association<Invoice, Table>;
  };
}

InvoiceItem.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    tax: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "InvoiceItems",
  }
);

export { InvoiceItem };
