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
import { Restaurant } from "@app/db/models/restaurant";
import { sequelize } from "@app/db/conn";

class User extends Model<
    InferAttributes<User, { omit: "restaurant" }>,
    InferCreationAttributes<User, { omit: "restaurant" }>
> {
    declare id: CreationOptional<string>;
    declare name: string;
    declare email: string;
    declare phone: CreationOptional<string>;
    declare designation: CreationOptional<string>;
    declare password: string;
    declare restaurantId: ForeignKey<Restaurant["id"]>;
    declare permissions: CreationOptional<Array<string>>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare loggedAt: CreationOptional<Date>;

    declare restaurant?: NonAttribute<Restaurant>;

    declare static associations: {
        restaurant: Association<User, Restaurant>;
    };
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false,
            allowNull: false,
            defaultValue: UUIDV4,
        },
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        designation: DataTypes.STRING,
        password: DataTypes.STRING,
        name: DataTypes.STRING,
        permissions: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        loggedAt: DataTypes.DATE
    },
    {
        sequelize,
        tableName: "Users",
    }
);

export { User };
