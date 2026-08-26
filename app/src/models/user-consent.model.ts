import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// define los atributos de la entidad UserConsent
interface UserConsentAttributes {
    id: number;
    userId: number;
    consentType: string;
    accepted: boolean;
    acceptedAt?: Date;
}

// define los atributos de creación de la entidad UserConsent
interface UserConsentCreationAttributes
    // define que campos son opcionales al momento de crear un nuevo registro
    extends Optional<UserConsentAttributes, "id" | "acceptedAt"> {}

// define la clase UserConsent que hereda de Model de Sequelize
class UserConsent
    // hereda las funciones de sequealize
    extends Model<UserConsentAttributes, UserConsentCreationAttributes>
    implements UserConsentAttributes {

    // id del registro
    public id!: number;
    // id del usuario al que pertenece el consentimiento
    public userId!: number;
    // tipo de consentimiento (por ejemplo, "data_processing")
    public consentType!: string;
    // indica si el consentimiento fue aceptado o no
    public accepted!: boolean;
    // fecha y hora en que se aceptó el consentimiento (opcional)
    public acceptedAt?: Date;
}

// Inicializa el modelo UserConsent con sus atributos y opciones de configuración
UserConsent.init(
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

        consentType: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: "consent_type"
        },

        accepted: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },

        acceptedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "accepted_at"
        }
    },
    {
        sequelize,
        modelName: "UserConsent",
        tableName: "user_consents",
        timestamps: false
    }
);
export default UserConsent;