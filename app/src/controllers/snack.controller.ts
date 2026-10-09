import { Request, Response } from "express";
import snackService from "../services/snack.service";
import AppError from "../error/appError";

// obtiene todas las categorias de confiteria
export const getSnackCategories = async (
    req: Request,
    res: Response
): Promise<Response> => {

    try {

        // obtiene las categorias desde el services
        const categories = await snackService.getCategories();

        // duevuelve las categorias con estado 200
        return res.status(200).json(categories);

    } catch (error: any) {

        // Maneja errores controlados de la aplicación.
        if (error instanceof AppError) {
            return res
                .status(error.status)
                .json({ message: error.message });
        }

        // Maneja errores inesperados
        return res.status(500).json({
            error: error.message,
        });
    }
};

// obtiene los productos de confiteria
// puede recibir un categoryId como filtro 
export const getSnacks = async (
    req: Request,
    res: Response
): Promise<Response> => {

    try {
        // Obtiene el categoryId desde los parámetros de consulta.
        // req.query sirve para obtener un filtro opcional
        const categoryId = req.query.categoryId
            // lo convierte a 2
            ? Number(req.query.categoryId)
            : undefined;

        // Verifica que categoryId sea un número entero.
        if (
            categoryId !== undefined &&
            !Number.isInteger(categoryId)
        ) {
            return res.status(400).json({
                message: "categoryId debe ser un número entero",
            });
        }

        // Obtiene los productos desde el Service.
        const products =
            await snackService.getProducts(categoryId);

        // Devuelve los productos con estado 200.
        return res.status(200).json(products);

    } catch (error: any) {

        // Maneja errores controlados de la aplicación.
        if (error instanceof AppError) {
            return res
                .status(error.status)
                .json({ message: error.message });
        }

        // Maneja errores inesperados.
        return res.status(500).json({
            error: error.message,
        });
    }
};

// Obtiene un producto de confitería por su id.
export const getSnackById = async (
    req: Request,
    res: Response
): Promise<Response> => {

    try {

        // Obtiene el id desde los parámetros de la URL.
        // de esos parametros, especificamente el que se lñ+lama id
        const id = Number(req.params.id);

        // Verifica que el ID sea un número entero.
        if (!Number.isInteger(id)) {
            return res.status(400).json({
                message: "El id debe ser un número entero",
            });
        }

        // Busca el producto mediante el Service.
        const product =
            await snackService.getProductById(id);

        // Devuelve el producto con estado 200.
        return res.status(200).json(product);

    } catch (error: any) {

        // Maneja errores controlados de la aplicación.
        if (error instanceof AppError) {
            return res
                .status(error.status)
                .json({ message: error.message });
        }

        // Maneja errores inesperados.
        return res.status(500).json({
            error: error.message,
        });
    }
};