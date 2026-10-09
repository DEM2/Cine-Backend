import { Router } from "express";
import {getSnackCategories, getSnacks, getSnackById,} from "../controllers/snack.controller";

// creamos el router de confiteria
const router = Router();

// get/categories, obtiene todas las categorias
/** 
 * GET /categories
 * ----------------
 * Obtiene todas las categorías de confitería.
 * 
 * @swagger
 * /api/snacks/categories:
 *   get:
 *     summary: Obtener categorías de confitería
 *     tags: [Snacks]
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: "Bebidas"
 *                 description: "Bebidas de diferentes tamaños y sabores"
 *               - id: 2
 *                 name: "Comidas"
 *                 description: "Comidas de diferentes tamaños"
 *               - id: 3
 *                 name: "Dulces"
 *                 description: "Dulces de diferentes tamaños y sabores"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al obtener las categorías"
 */
router.get("/categories", getSnackCategories);

// get/, obtiene todos los productos o los filtra por categoria
/**
 * GET /
 * -------
 * Obtiene los productos de confitería.
 *
 * @swagger
 * /api/snacks:
 *   get:
 *     summary: Obtener productos de confitería
 *     description: Obtiene todos los productos activos o los filtra por categoría.
 *     tags:
 *       - Snacks
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         required: false
 *         description: ID de la categoría para filtrar los productos.
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 categoryId: 1
 *                 name: "Crispetas grandes"
 *                 description: "Crispetas de maíz tamaño grande"
 *                 price: 15000
 *                 imageUrl: "https://ejemplo.com/crispetas.jpg"
 *                 stockQuantity: 50
 *                 isActive: true
 *                 createdAt: "2026-08-25T10:00:00.000Z"
 *                 category:
 *                   id: 1
 *                   name: "Comidas"
 *                   description: "Productos de comida"
 *               - id: 2
 *                 categoryId: 1
 *                 name: "Gaseosa"
 *                 description: "Gaseosa personal"
 *                 price: 7000
 *                 imageUrl: "https://ejemplo.com/gaseosa.jpg"
 *                 stockQuantity: 30
 *                 isActive: true
 *                 createdAt: "2026-08-25T10:00:00.000Z"
 *                 category:
 *                   id: 1
 *                   name: "Bebidas"
 *                   description: "Bebidas frías"
 *       400:
 *         description: El categoryId debe ser un número entero.
 *         content:
 *           application/json:
 *             example:
 *               message: "categoryId debe ser un número entero"
 *       404:
 *         description: Categoría de confitería no encontrada.
 *         content:
 *           application/json:
 *             example:
 *               message: "Categoría de confitería no encontrada"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al obtener los productos"
 */
router.get("/", getSnacks);


// get/:id, obtiene un producto especifico por su id 
/** 
* @swagger
 * /api/snacks/{id}:
 *   get:
 *     summary: Obtener un producto de confitería por ID
 *     tags: [Snacks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *         example: 1
 *     responses:
 *       200:
 *         description: Producto obtenido exitosamente
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: "Crispetas Grandes"
 *               description: "Crispetas de maíz grandes"
 *               price: 15000
 *               categoryId: 2
 *               isActive: true
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             example:
 *               message: "El id debe ser un número entero"
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Producto de confitería no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al obtener el producto"
 */
router.get("/:id", getSnackById);

export default router;