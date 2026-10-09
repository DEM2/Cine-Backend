import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// define los atributos de la entidad EmailVerification
interface EmailVerificationAttributes {
    id: number;
    userId: number;
    tokenHash: string;
    // fecha de expiración del token
    expiresAt: Date;
    // fecha de uso del token (opcional)
    usedAt?: Date;
}

// define los atributos de creación de la entidad EmailVerification
interface EmailVerificationCreationAttributes
    // define que campos son opcionales al momento de crear un nuevo registro
    extends Optional<EmailVerificationAttributes, "id" | "usedAt"> {}

// define la clase EmailVerification que hereda de Model de Sequelize
// esta clase reprsenta un tocken de verificacion asociado a un usuario, 
// que se utiliza para verificar su correo electrónico
class EmailVerification
    // hereda las funciones de sequealize
    extends Model<
        EmailVerificationAttributes,
        EmailVerificationCreationAttributes
    >
    implements EmailVerificationAttributes {

    // id del registro
    public id!: number;
    // id del usuario al que pertenece la verificación de correo
    public userId!: number;
    // hash del token de verificación de correo
    public tokenHash!: string;
    // fecha de expiración del token
    public expiresAt!: Date;
    // fecha de uso del token (opcional)
    public usedAt?: Date;
}

// Inicializa el modelo EmailVerification con sus atributos y opciones de configuración
EmailVerification.init(
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

        tokenHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: "token_hash"
        },

        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "expires_at"
        },

        usedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "used_at"
        }
    },
    {
        sequelize,
        modelName: "EmailVerification",
        tableName: "email_verifications",
        timestamps: false
    }
);

export default EmailVerification;

