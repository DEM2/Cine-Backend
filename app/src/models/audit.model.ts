import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class Audit extends Model {
  public id!: number;
  public userId!: number | null;
  public event!: string;
  public ip!: string;
  public device!: string;
}

Audit.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Nullable por si alguien intenta loguearse con un correo que no existe
  },
  event: {
    type: DataTypes.STRING,
    allowNull: false, // Ej: 'LOGIN_SUCCESS', 'LOGIN_FAILED'
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  device: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Audit',
  tableName: 'login_audits',
  timestamps: true // Fundamental para saber la hora exacta del intento
});