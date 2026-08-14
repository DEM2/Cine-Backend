// app/src/models/city.model.ts

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface CityAttributes {
  id: number;
  name: string;
  departmentId: number;
  isActive: boolean;
}

export interface CityCreationAttributes extends Optional<CityAttributes, "id"> {}

class City extends Model<CityAttributes, CityCreationAttributes> implements CityAttributes {
  public id!: number;
  public name!: string;
  public departmentId!: number;
  public isActive!: boolean;
}

City.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "department_id",
      references: {
        model: "departments",
        key: "id",
      },
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
    modelName: "City",
    tableName: "cities",
    timestamps: true,
  }
);

export default City;