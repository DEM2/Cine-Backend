import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// define los atributos de la entidad Membership
interface MembershipAttributes {
    id: number;
    userId: number;
    levelId: number;
    membershipNumber: string;
    qrCode?: string;
    currentPoints: number;
    status: string;
    validUntil?: Date;
}

// exporta la interfaz MembershipCreationAttributes que extiende de Optional para hacer que los campos "id", "qrCode" y "validUntil" sean opcionales al crear un nuevo registro de membresía
export interface MembershipCreationAttributes
    // define que campos son opcionales al momento de crear un nuevo registro
    extends Optional<
        MembershipAttributes,
        "id" | "qrCode" | "validUntil"
    > {}

// define la clase Membership que hereda de Model de Sequelize   
class Membership
    // hereda las funciones de sequealize
    extends Model<MembershipAttributes, MembershipCreationAttributes>
    implements MembershipAttributes {

    // id del registro
    public id!: number;
    // id del usuario al que pertenece la membresía
    public userId!: number;
    // id del nivel de membresía
    public levelId!: number;
    // número de membresía único
    public membershipNumber!: string;
    // código QR asociado a la membresía (opcional)
    public qrCode?: string;
    // puntos actuales acumulados por el usuario
    public currentPoints!: number;
    // estado de la membresía (activo, inactivo, suspendido, etc.)
    public status!: string;
    // fecha de vencimiento de la membresía (opcional)
    public validUntil?: Date;
}

// Inicializa el modelo Membership con sus atributos y opciones de configuración
Membership.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "user_id"
        },

        levelId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "level_id"
        },

        membershipNumber: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
            field: "membership_number"
        },

        qrCode: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: "qr_code"
        },

        currentPoints: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: "current_points"
        },

        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "ACTIVA"
        },

        validUntil: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "valid_until"
        }
    },
    {
        sequelize,
        modelName: "Membership",
        tableName: "memberships",
        timestamps: true
    }
);

export default Membership;
