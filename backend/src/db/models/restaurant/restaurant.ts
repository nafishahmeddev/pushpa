import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  UUIDV4,
  ForeignKey,
} from "sequelize";
import { ProductCategory } from "../product/product-category";
import { sequelize } from "@app/db/conn";
import { User } from "../user/user";

class Restaurant extends Model<
  InferAttributes<Restaurant, { omit: "categories" }>,
  InferCreationAttributes<Restaurant, { omit: "categories" }>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare address: string;
  declare phone: string;
  declare email: string;
  declare currency: string;
  declare country: string;
  declare ownerId: ForeignKey<User["id"]>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare categories?: NonAttribute<ProductCategory[]>;
  declare admin?: NonAttribute<User>;

}

Restaurant.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    country: DataTypes.STRING,
    currency: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelize,
    tableName: "Restaurants",
    paranoid: true,
  }
);

export { Restaurant };
