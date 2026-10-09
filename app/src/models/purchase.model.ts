// app/src/models/purchase.model.ts

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface PurchaseAttributes {
    id: number;
    userId: number;
    totalAmount: number;
    status: string; 
    purchaseDate: Date;
}

export interface PurchaseCreationAttributes extends Optional<PurchaseAttributes, "id" | "purchaseDate" | "status"> {}

class Purchase extends Model<PurchaseAttributes, PurchaseCreationAttributes> implements PurchaseAttributes {
    public id!: number;
    public userId!: number;
    public totalAmount!: number;
    public status!: string;
    public readonly purchaseDate!: Date;
}

Purchase.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "user_id",
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: "total_amount",
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "COMPLETED", // Podría ser COMPLETED, CANCELLED, REFUNDED
        },
        purchaseDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "purchase_date",
        }
    },
    {
        sequelize,
        modelName: "Purchase",
        tableName: "purchases",
        timestamps: true, // Manejará createdAt y updatedAt automáticamente
    }
);

export default Purchase;