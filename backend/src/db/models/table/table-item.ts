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
import { Order } from "../order/order";
import { Product } from "../product/product";
import { Table } from "./table";

type TableItemStatus = "Pending" | "Preparing" | "Served";
class TableItem extends Model<
    InferAttributes<TableItem, { omit: "table" }>,
    InferCreationAttributes<TableItem, { omit: "table" }>
> {
    declare id: CreationOptional<string>;
    declare quantity: number;
    declare status: CreationOptional<TableItemStatus>;

    declare tableId: ForeignKey<Order["id"]>;
    declare productId: ForeignKey<Product["id"]>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare table?: NonAttribute<Table>;
    declare product?: NonAttribute<Product>;

    declare static associations: {
        table: Association<TableItem, Table>;
        product: Association<TableItem, Product>;
    };
}

TableItem.init(
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
            values: ["Pending", "Preparing", "Served"],
            defaultValue:"Pending"
        },
        quantity: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "TableItems",
    }
);

export { TableItem };
