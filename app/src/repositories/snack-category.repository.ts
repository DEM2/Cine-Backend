import SnackCategory from "../models/snack/snack-category.model";
// consultas relacionadas con las categorias de snacks
// accede a la base de datos mediante el modelo SnackCategory
class SnackCategoryRepository {

    // obtiene todas las categorias de snacks registrados.
    // @returns una lista con todas las categorias de snacks
    async findAll(): Promise<SnackCategory[]> {
        return await SnackCategory.findAll({
            // ordena las categorias por el campo "name"
            // de forma ascendente (A-Z)
            order: [["name", "ASC"]],
        });
    }

    // busca una categotia de snack por su id 
    // @returns la categoria encontrada o null si no existe
    async findById(id: number): Promise<SnackCategory | null> {
        // findByPk busca un registro utilizando su clave primaria (id)
        return await SnackCategory.findByPk(id);
    }
}

export default new SnackCategoryRepository();