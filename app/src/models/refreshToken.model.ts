import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class RefreshToken extends Model {
  public id!: number;
  public userId!: number;
  public token!: string;
  public expiresAt!: Date;
}

RefreshToken.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Aquí Sequelize creará la llave foránea automáticamente luego con las asociaciones
  },
  token: {
    type: DataTypes.STRING(500), // Usamos 500 por si el JWT es muy largo
    allowNull: false,
    unique: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'RefreshToken',
  tableName: 'refresh_tokens',
  timestamps: true // Crea createdAt y updatedAt
});