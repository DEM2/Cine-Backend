import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface CinemaComplexAttributes {
    id: number;
    cityId: number;
    name: string;
    address: string;
    isActive: boolean;
}

export interface CinemaComplexCreationAttributes
// hereda las prpiedades pero con id opcional
    extends Optional<CinemaComplexAttributes, "id"> {}

// hereda las funciones de sequealize
export class CinemaComplex
    extends Model<
        //complejo completo
        CinemaComplexAttributes,
        //datos necesarios para crear un complejo
        CinemaComplexCreationAttributes
    >
    implements CinemaComplexAttributes {

    declare id: number;
    declare cityId: number;
    declare name: string;
    declare address: string;
    declare isActive: boolean;
}

CinemaComplex.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        cityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "city_id",
            references: {
                model: "cities",
                key: "id",
            },
        },

        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: "is_active",
        },
    },
    {
        sequelize,
        modelName: "CinemaComplex",
        tableName: "cinema_complexes",
        timestamps: true,
    }
);