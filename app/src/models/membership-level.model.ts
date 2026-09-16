import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// Definición de la interfaz que representa los atributos de un nivel de membresía.
interface MembershipLevelAttributes {
    id: number;
    name: string;
    description?: string;
}

// Definición de la interfaz que representa los atributos necesarios para crear un nivel de membresía.
interface MembershipLevelCreationAttributes
    // Extiende de Optional para hacer que los campos "id" y "description" sean opcionales al crear un nuevo nivel de membresía.
    extends Optional<MembershipLevelAttributes, "id" | "description"> {}

// Definición de la clase MembershipLevel que extiende de Model y utiliza las interfaces definidas anteriormente.
class MembershipLevel
    extends Model<MembershipLevelAttributes, MembershipLevelCreationAttributes>
    implements MembershipLevelAttributes {

    public id!: number;
    public name!: string;
    public description?: string;
}

// Inicialización del modelo MembershipLevel con Sequelize.
MembershipLevel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: "MembershipLevel",
        tableName: "membership_levels",
        timestamps: true
    }
);

export default MembershipLevel;