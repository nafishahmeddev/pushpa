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
import { Kot } from "./kot";
import { Product } from "../product/product";

class KotItem extends Model<
    InferAttributes<KotItem, { omit: "kot" | "product" }>,
    InferCreationAttributes<KotItem, { omit: "kot" | "product" }>
> {
    declare id: CreationOptional<string>;
    declare kotId: ForeignKey<Kot["id"]>;
    declare productId: ForeignKey<Product["id"]>;
    declare quantity: number;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare kot?: NonAttribute<Kot>;
    declare product?: NonAttribute<Product>;

    declare static associations: {
        kot: Association<KotItem, Kot>;
        product: Association<KotItem, Product>;
    };
}

KotItem.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            allowNull: false,
            defaultValue: UUIDV4,
        },
        quantity: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize: sequelize,
        tableName: "KotItems",
    }
);

export { KotItem };
