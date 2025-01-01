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
import { ProductCategory } from "./product-category";

type ProductStatus = "Active" | "Inactive";

class Product extends Model<
  InferAttributes<Product, { omit: "category" }>,
  InferCreationAttributes<Product, { omit: "category" }>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare description: CreationOptional<string>;
  declare categoryId: ForeignKey<ProductCategory["id"]>;
  declare status: ProductStatus;
  declare netPrice: number;
  declare price: number;
  declare tax: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare category?: NonAttribute<ProductCategory>;

  declare static associations: {
    category: Association<Product, ProductCategory>;
  };
}

Product.init(
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
      values: ["Active", "Inactive"],
      defaultValue: "Active",
    },
    netPrice: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    price: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    tax: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "Products",
    paranoid: true,
  }
);

export { Product };
