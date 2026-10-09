import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class Benefit extends Model {
  public id!: number;
  public userId!: number;
  public name!: string;
  public description!: string;
  public status!: string;
}

Benefit.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Ej: 'Entrada 2x1', 'Palomitas Gratis'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active', // Estados: 'active', 'used', 'expired'
  }
}, {
  sequelize,
  modelName: 'Benefit',
  tableName: 'benefits',
  timestamps: true
});