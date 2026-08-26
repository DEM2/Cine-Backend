import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface CartAttributes {
  id: number;
  userId: number;
  status: "ACTIVE" | "EXPIRED" | "COMPLETED" | "CANCELLED";

  subtotal: number;
  membershipDiscount: number;
  promotionDiscount: number;
  giftCardDiscount: number;
  taxes: number;
  total: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export class Cart extends Model<CartAttributes> implements CartAttributes {
    public id!: number;
    public userId!: number;
    public status!: "ACTIVE" | "EXPIRED" | "COMPLETED" | "CANCELLED";

    public subtotal!: number;
    public membershipDiscount!: number;
    public promotionDiscount!: number;
    public giftCardDiscount!: number;
    public taxes!: number;
    public total!: number;
}

Cart.init({
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status:{
        type: DataTypes.ENUM("ACTIVE", "EXPIRED", "COMPLETED", "CANCELLED"),
        allowNull: false,
        defaultValue: "ACTIVE"
    },
    subtotal:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    membershipDiscount:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    promotionDiscount:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    giftCardDiscount:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    taxes:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    total:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    }
},{
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',
    timestamps: true
})