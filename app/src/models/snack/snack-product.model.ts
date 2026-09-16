import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";

// atributos de un producto de confiteria
export interface SnackProductAttributes {
    id: number;
    categoryId: number;
    name: string;
    description: string | null;
    price: number;
    // url de la imagen que se mostrara en el catalogo
    imageUrl: string | null;
    // cantidad disponible actualmente en inventario
    stockQuantity: number;
    //  indica si el producto esta activo y puede mostrarse
    isActive: boolean;
    createdAt?: Date;
}

/**
 * Define los campos que son opcionales al momento
 * de crear un nuevo producto.
 *
 * El id es generado automáticamente por PostgreSQL.
 * La descripción, imagen y fecha pueden ser opcionales.
 */
export interface SnackProductCreationAttributes
    extends Optional<
        SnackProductAttributes,
        "id" | "description" | "imageUrl" | "createdAt"
    > {}


class SnackProduct extends Model<
    SnackProductAttributes,
    SnackProductCreationAttributes
    // La clase SnackProduct está obligada a tener 
    // las propiedades que definimos en SnackProductAttributes
> implements SnackProductAttributes {

    public id!: number;
    public categoryId!: number;
    public name!: string;
    public description!: string | null;
    public price!: number;
    public imageUrl!: string | null;
    public stockQuantity!: number;
    public isActive!: boolean;
    public createdAt?: Date;
}

// configuracion de sequelize
SnackProduct.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "category_id",
        },

        name: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },

        imageUrl: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: "image_url",
        },

        stockQuantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "stock_quantity",
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            field: "is_active",
        },

        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "created_at",
        },
    },
    {
        sequelize,
        modelName: "SnackProduct",
        tableName: "snack_products",
        timestamps: false,
    }
);

export default SnackProduct;