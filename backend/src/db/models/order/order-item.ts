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
import { Table } from "../table/table";
import { Order } from "./order";

class OrderItem extends Model<
  InferAttributes<OrderItem, { omit: "order" }>,
  InferCreationAttributes<OrderItem, { omit: "order" }>
> {
  declare id: CreationOptional<string>;
  declare quantity: number;
  declare name: string;
  declare price: number;
  declare amount: number;
  declare cgst: number;
  declare sgst: number;


  declare orderId: ForeignKey<Order["id"]>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;


  declare order?: NonAttribute<Table>;

  declare static associations: {
    order: Association<Order, Table>;
  };
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
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    cgst: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    sgst: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
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
