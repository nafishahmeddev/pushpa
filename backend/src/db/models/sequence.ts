import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  UUIDV4,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../conn";
import { Restaurant } from "./restaurant/restaurant";

class Sequence extends Model<
  InferAttributes<Sequence>,
  InferCreationAttributes<Sequence>
> {
  declare id: CreationOptional<string>;
  declare table: string;
  declare restaurantId: ForeignKey<Restaurant["id"]>;
  declare value:number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Sequence.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    table: DataTypes.STRING,
    value: DataTypes.BIGINT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "Sequences",
  }
);

export { Sequence };
