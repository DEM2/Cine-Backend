import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "../../config/database";

// datos que tiene una categoria
export interface SnackCategoryAttributes {
  id: number;
  name: string;
  description: string | null;
}

// 
export interface SnackCategoryCreationAttributes
  extends Optional<SnackCategoryAttributes, "id" | "description"> {}

// representa una categoria de productos de confiteria
class SnackCategory
  extends Model<SnackCategoryAttributes, SnackCategoryCreationAttributes>
  // obliga a que la clase tenga esos atributos
  implements SnackCategoryAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;
}

// configuracion de sequelize 
SnackCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "SnackCategory",
    tableName: "snack_categories",
    timestamps: true,
  }
);

export default SnackCategory;