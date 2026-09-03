// app/src/models/user.model.ts

/**
 * Modelo de Usuario
 *
 * Representa la tabla "users" de la base de datos.
 *
 * En TypeScript se utilizan nombres camelCase.
 * Sequelize los mapea a los nombres snake_case de PostgreSQL
 * mediante la propiedad "field".
 */

import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/database";

/**
 * Atributos principales del usuario.
 */
export interface UserAttributes {
    id: number;
    email: string;
    password: string;

    documentTypeId: number;
    documentNumber: string;

    firstName: string;
    lastName: string;
    birthDate: string;

    gender?: string;
    phone: string;
    address: string;

    cityId: number;
    roleId: number;

    isVerified: boolean;

    failedLoginAttempts: number;
    lockoutUntil?: Date | null;

    status: string;

    favoriteComplexId?: number | null;

    photoUrl?: string | null;
    pendingEmail?: string | null;
}

/**
 * Atributos utilizados al crear un usuario.
 *
 * Estos campos son opcionales porque tienen valores
 * automáticos o predeterminados.
 */
export interface UserCreationAttributes
    extends Optional<
        UserAttributes,
        "id" | "failedLoginAttempts" | "lockoutUntil"| "photoUrl" | "pendingEmail"
    > {}

/**
 * Modelo User de Sequelize.
 */
class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {

    /**
     * Identificador único.
     */
    public id!: number;

    /**
     * Correo electrónico.
     */
    public email!: string;

    /**
     * Contraseña encriptada.
     *
     * En PostgreSQL se almacena en la columna:
     * password_hash
     */
    public password!: string;

    /**
     * Tipo de documento.
     */
    public documentTypeId!: number;

    /**
     * Número de documento.
     */
    public documentNumber!: string;

    /**
     * Nombre.
     */
    public firstName!: string;

    /**
     * Apellido.
     */
    public lastName!: string;

    /**
     * Fecha de nacimiento.
     */
    public birthDate!: string;

    /**
     * Género.
     */
    public gender?: string;

    /**
     * Teléfono.
     */
    public phone!: string;

    /**
     * Dirección.
     */
    public address!: string;

    /**
     * Ciudad.
     */
    public cityId!: number;

    /**
     * Rol.
     */
    public roleId!: number;

    /**
     * Indica si el correo electrónico fue verificado.
     */
    public isVerified!: boolean;

    /**
     * Cantidad de intentos fallidos de inicio de sesión.
     *
     * En PostgreSQL:
     * failed_login_attempts
     */
    public failedLoginAttempts!: number;

    /**
     * Fecha hasta la cual la cuenta permanece bloqueada.
     *
     * En PostgreSQL:
     * lockout_until
     */
    public lockoutUntil?: Date | null;

    /**
     * Estado de la cuenta.
     */
    public status!: string;

    /**
     * Complejo favorito.
     */
    public favoriteComplexId?: number | null;

    /**
     * Fotografía de perfil del usuario.
     * 
     * En PostgreSQL:
     * photo_url
     */
    public photoUrl?: string | null;

    /**
     * Correo electrónico temporal pendiente de verificación.
     * 
     * En PostgreSQL:
     * pending_email
     */
    public pendingEmail?: string | null;

    /**
     * Validar contraseña.
     *
     * Compara la contraseña ingresada con la contraseña
     * encriptada almacenada en la base de datos.
     */
    public async validPassword(
        password: string
    ): Promise<boolean> {
        return await bcrypt.compare(
            password,
            this.password
        );
    }
}

/**
 * Inicialización del modelo.
 */
User.init(
    {
        /**
         * ID
         */
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        /**
         * Correo electrónico
         */
        email: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false,
        },

        /**
         * Contraseña
         *
         * En TypeScript: password
         * En PostgreSQL: password_hash
         */
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: "password_hash",
        },

        /**
         * Tipo de documento
         */
        documentTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "document_type_id",
            references: {
                model: "document_types",
                key: "id",
            },
        },

        /**
         * Número de documento
         */
        documentNumber: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
            field: "document_number",
        },

        /**
         * Nombre
         */
        firstName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "first_name",
        },

        /**
         * Apellido
         */
        lastName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "last_name",
        },

        /**
         * Fecha de nacimiento
         */
        birthDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            field: "birth_date",
        },

        /**
         * Género
         */
        gender: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },

        /**
         * Teléfono
         */
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },

        /**
         * Dirección
         */
        address: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        /**
         * Ciudad
         */
        cityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "city_id",
            references: {
                model: "cities",
                key: "id",
            },
        },

        /**
         * Rol
         */
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "role_id",
            references: {
                model: "roles",
                key: "id",
            },
        },

        /**
         * Correo verificado
         *
         * RN-031
         */
        isVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

        /**
         * Cantidad de intentos fallidos.
         *
         * En TypeScript:
         * failedLoginAttempts
         *
         * En PostgreSQL:
         * failed_login_attempts
         */
        failedLoginAttempts: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: "failed_login_attempts",
        },

        /**
         * Fecha hasta la cual la cuenta está bloqueada.
         *
         * En TypeScript:
         * lockoutUntil
         *
         * En PostgreSQL:
         * lockout_until
         */
        lockoutUntil: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "lockout_until",
        },

        /**
         * Estado de la cuenta.
         */
        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "INACTIVO",
        },

        /**
         * Complejo favorito.
         */
        favoriteComplexId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "favorite_complex_id",
        },
        
        /**
         * Fotografía de perfil opcional.
         * 
         * Requisito de la HU-008
         */
        photoUrl: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: "photo_url",
        },

        /**
         * Correo temporal para procesos de actualización.
         * 
         * Requisito de la RN-034
         */
        pendingEmail: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: "pending_email",
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",

        /**
         * Sequelize manejará automáticamente:
         * createdAt
         * updatedAt
         */
        timestamps: true,

        /**
         * Encriptar contraseña automáticamente
         * antes de crear el usuario.
         */
        hooks: {
            beforeCreate: async (user: User) => {
                const salt = await bcrypt.genSalt(10);

                user.password = await bcrypt.hash(
                    user.password,
                    salt
                );
            },
        },
    }
);

export default User;