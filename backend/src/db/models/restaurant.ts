import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  Model,
  ModelDefined,
  Optional,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey,
  UUIDV4,
} from "sequelize";
import { sequelize } from "../conn";
import { ProductCategory } from "./product/product-category";

class Restaurant extends Model<
  InferAttributes<Restaurant, { omit: "categories" }>,
  InferCreationAttributes<Restaurant, { omit: "categories" }>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare address: string;
  declare phone: string;
  declare email: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare categories?: NonAttribute<ProductCategory[]>;

  declare static associations: {
    categories: Association<Restaurant, ProductCategory>;
  };
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "Restaurants",
  }
);

export { Restaurant };
