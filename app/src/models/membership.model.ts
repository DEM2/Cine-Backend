import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class Membership extends Model {
  public id!: number;
  public userId!: number;
  public tier!: string;
  public points!: number;
}

Membership.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Relación 1 a 1: Un usuario tiene una sola membresía
  },
  tier: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Standard', // Niveles: Standard, Gold, VIP, etc.
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  }
}, {
  sequelize,
  modelName: 'Membership',
  tableName: 'memberships',
  timestamps: false, // false porque no necesitamos created_at ni updated_at.
});