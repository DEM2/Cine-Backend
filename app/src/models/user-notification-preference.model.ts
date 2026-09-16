import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// define los atributos de la entidad UserNotificationPreference
interface UserNotificationPreferenceAttributes {
    id: number;
    userId: number;
    transactionalEmail: boolean;
    promotionalEmail: boolean;
    sms: boolean;
    push: boolean;
    updatedAt?: Date;
}

// define los atributos de creación de la entidad UserNotificationPreference
interface UserNotificationPreferenceCreationAttributes
    // define que campos son opcionales al momento de crear un nuevo registro
    extends Optional<
        UserNotificationPreferenceAttributes,
        "id" | "updatedAt"
    > {}

// define la clase UserNotificationPreference que hereda de Model de Sequelize
class UserNotificationPreference
    // hereda las funciones de sequealize
    extends Model<
        UserNotificationPreferenceAttributes,
        UserNotificationPreferenceCreationAttributes
    >
    implements UserNotificationPreferenceAttributes {
    
    // id del registro
    public id!: number;
    // id del usuario al que pertenece la preferencia de notificación
    public userId!: number;
    // preferencias de notificación del usuario
    public transactionalEmail!: boolean;
    // preferencias de notificación del usuario
    public promotionalEmail!: boolean;
    // preferencias de notificación del usuario
    public sms!: boolean;
    // preferencias de notificación del usuario
    public push!: boolean;
    // fecha de actualización del registro (opcional)
    public updatedAt?: Date;
}

// Inicializa el modelo UserNotificationPreference con sus atributos y opciones de configuración
UserNotificationPreference.init(
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

        transactionalEmail: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // por defecto, se asume que el usuario acepta recibir correos transaccionales, 
            // ya que son necesarios para la operación de la plataforma
            defaultValue: true,
            field: "transactional_email"
        },

        promotionalEmail: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: "promotional_email"
        },

        sms: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        push: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        sequelize,
        modelName: "UserNotificationPreference",
        tableName: "user_notification_preferences",
        timestamps: true,
        createdAt: false,
        updatedAt: "updated_at"
    }
);
export default UserNotificationPreference;