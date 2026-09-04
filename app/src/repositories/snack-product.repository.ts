import { Op } from "sequelize";
import SnackProduct from "../models/snack/snack-product.model";
import SnackCategory from "../models/snack/snack-category.model";

// realiza consultas relacionadas con los productos de snacks
// Se utiliza el modelo SnackProduct para consultar los productos
// y SnackCategory para obtener la categoría relacionada.
class SnackProductRepository {

    // obtiene todos los productos de snack que estes activos e incluye informacion de la 
    // categoria a la que pertenece cada producto
    // @returns una lista con todos los productos de snack activos
    async findAll(): Promise<SnackProduct[]> {
        return await SnackProduct.findAll({
            // solo obtiene los productos que estan activos
            where: {
                isActive: true,
                stockQuantity: { [Op.gt]: 0 },
            },
            // incluye la categoria relacionada con cada producto
            include: [
                {
                    model: SnackCategory,
                    as: "category",
                },
            ],
            // ordena los productos por nombre de (A-Z)
            order: [["name", "ASC"]],
        });
    }

    // obtiene los productos de una categoria especifica
    // solo devuelve productos que esten activos
    // @returns una lista con los productos activos de categoria indicada
    async findByCategory(categoryId: number): Promise<SnackProduct[]> {
        return await SnackProduct.findAll({
            // filtra los productos por categoria y verifica que esten activos
            where: {
                categoryId,
                isActive: true,
                stockQuantity: { [Op.gt]: 0 },
            },
            // incluye la informacion de la categoria del producto
            include: [
                {
                    model: SnackCategory,
                    as: "category",
                },
            ],

            order: [["name", "ASC"]],
        });
    }

    // busca un producto por su id y solo lo devuelve si esta activo
    // tambien inncluye la informacion de su categoria
    // @returns el producto encontrado o null si no existe
    async findById(id: number): Promise<SnackProduct | null> {
        return await SnackProduct.findOne({
            // busca el procuto por su id y verifica que esté activo
            where: {
                id,
                isActive: true,
            },
            // Incluye la categoría relacionada con el producto.
            include: [
                {
                    model: SnackCategory,
                    as: "category",
                },
            ],
        });
    }
}

export default new SnackProductRepository();