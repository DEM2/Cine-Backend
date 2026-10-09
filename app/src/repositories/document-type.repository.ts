// app/src/repositories/document-type.repository.ts

import DocumentType from "../models/document-type.model";
import { IDocumentTypeRepository } from "./interfaces/document-type.repository.interface";

/**
 * Repositorio de Tipos de Documento
 * -----------------------------------
 * Implementa el patrón Repository para encapsular todas las operaciones
 * de persistencia relacionadas con la entidad DocumentType.
 *
 * Esta clase es la única responsable de interactuar con Sequelize.
 */

class DocumentTypeRepository implements IDocumentTypeRepository {

    /**
     * Obtiene un tipo de documento por su identificador.
     */
    async findById(id: number): Promise<DocumentType | null> {

        return await DocumentType.findByPk(id);

    }

}

export default new DocumentTypeRepository();