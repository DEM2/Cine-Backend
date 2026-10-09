// app/src/repositories/interfaces/document-type.repository.interface.ts

import DocumentType from "../../models/document-type.model";

/**
 * Contrato del Repositorio de Tipos de Documento
 * ------------------------------------------------
 * Define las operaciones de persistencia disponibles para la entidad DocumentType.
 *
 * Cualquier implementación deberá cumplir esta interfaz.
 */

export interface IDocumentTypeRepository {

    /**
     * Obtiene un tipo de documento por su identificador.
     */
    findById(id: number): Promise<DocumentType | null>;

}