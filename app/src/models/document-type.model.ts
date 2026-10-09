// app/src/models/document-type.model.ts

/**
 * Modelo de Tipo de Documento
 * ---------------------------
 * Este archivo define el modelo `DocumentType` de Sequelize, que representa
 * la tabla `document_types` en la base de datos.
 *
 * Contiene:
 *  - Atributos del modelo (`DocumentTypeAttributes`).
 *  - Atributos requeridos para la creación (`DocumentTypeCreationAttributes`).
 *  - Definición del modelo con sus columnas y restricciones.
 *
 * Este modelo representa los distintos tipos de documento de identidad que
 * puede tener un usuario (Ej. Cédula de Ciudadanía, Tarjeta de Identidad,
 * Cédula de Extranjería, Pasaporte, etc.).
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad `DocumentType`.
 */
export interface DocumentTypeAttributes {
  id: number;
  name: string;
}

/**
 * Atributos utilizados para la creación de un nuevo tipo de documento.
 *
 * Se utiliza `Optional` para indicar que `id` no es requerido al momento
 * de la creación, ya que se genera automáticamente por la base de datos.
 */
export interface DocumentTypeCreationAttributes extends Optional<DocumentTypeAttributes, "id"> {}

/**
 * Clase que representa el modelo `DocumentType` en Sequelize.
 *
 * Implementa los atributos definidos en `DocumentTypeAttributes` y `DocumentTypeCreationAttributes`.
 */
class DocumentType extends Model<DocumentTypeAttributes, DocumentTypeCreationAttributes> implements DocumentTypeAttributes {
  /** Identificador único del tipo de documento (clave primaria). */
  public id!: number;

  /** Nombre del tipo de documento (Ej. "Cédula de Ciudadanía"). */
  public name!: string;
}

/**
 * Inicialización del modelo `DocumentType` con la configuración de Sequelize.
 *
 * - `id`: Entero autoincremental, clave primaria.
 * - `name`: Nombre obligatorio y único con máximo 100 caracteres.
 */
DocumentType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "DocumentType",       // Nombre del modelo en Sequelize
    tableName: "document_types",     // Nombre de la tabla en la base de datos
    timestamps: true,                // Incluye createdAt y updatedAt
  }
);

export default DocumentType;