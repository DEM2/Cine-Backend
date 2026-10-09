import snackCategoryRepository from "../repositories/snack-category.repository";
import snackProductRepository from "../repositories/snack-product.repository";
import AppError from "../error/appError";

// maneja la logica de negocio relacionada con la confiteria 
// utiliza los repositories para consultar las categorias y productos en la base de datos
class SnackService {

    // obtiene todas las categorias de confiteria 
    // @returns una lista con todas las categorias
    async getCategories() {
        // solicita al repository todas las categorias registradas
        return await snackCategoryRepository.findAll();
    }

    // obtiene los productos de confiteria
    // si se proporciona una categoryId, primero verifica que la categoria exista
    // y luego obtiene sus productos, si no se proporciona categoryId, obtiene todos los productos activos
    async getProducts(categoryId?: number) {

        //  verifica si el usuario proporciono un id de categoria
        if (categoryId !== undefined) {

            // busca la categoria para comprobar que exista 
            const category =
                await snackCategoryRepository.findById(categoryId);

            // si la categoria no existe, se lanza en error 404.
            if (!category) {
                throw new AppError(404, "Categoría de confitería no encontrada");
            }

            // Si la categoría existe, obtiene sus productos.
            return await snackProductRepository.findByCategory(categoryId);
        }

        // Si no se indicó una categoría, obtiene todos los productos activos.
        return await snackProductRepository.findAll();
    }

    // obtiene los productos por su id 
    async getProductById(id: number) {

        // busca el producto utilizando su id
        const product =
            await snackProductRepository.findById(id);

        // si no se encuentra el producto, se devuelve error 404
        if (!product) {
            throw new AppError(404, "Producto de confitería no encontrado");
        }
        // Devuelve el producto encontrado.
        return product;
    }
}

export default new SnackService();