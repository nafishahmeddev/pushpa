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
import { Order } from "./order";

class Kot extends Model<
    InferAttributes<Kot, { omit: "order" }>,
    InferCreationAttributes<Kot, { omit: "order" }>
> {
    declare id: CreationOptional<string>;
    declare orderId: ForeignKey<Order["id"]>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare order?: NonAttribute<Order>;
}

Kot.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            allowNull: false,
            defaultValue: UUIDV4,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize: sequelize,
        tableName: "Kots",
    }
);

export { Kot };
