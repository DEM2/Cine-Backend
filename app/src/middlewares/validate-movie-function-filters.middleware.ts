import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { FunctionFilterDto } from "../dto/funtion/funtion-filter.dto";

const movieFunctionRequestSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  query: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Debe tener formato YYYY-MM-DD").optional(),
    complexId: z.coerce.number().int().positive().optional(),
    roomId: z.coerce.number().int().positive().optional(),
    formatId: z.coerce.number().int().positive().optional(),
    language: z.string().trim().min(1).optional(),
    isSubtitled: z.enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
  }),
});

/**
 * Valida y transforma los parámetros de GET /api/movies/:id/functions.
 * Los valores transformados quedan disponibles en res.locals para el controlador.
 */
export const validateMovieFunctionFilters = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const result = movieFunctionRequestSchema.safeParse({
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    return res.status(400).json({
      error: "Parámetros de filtro inválidos.",
      details: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  res.locals.movieId = result.data.params.id;
  res.locals.filters = result.data.query as FunctionFilterDto;

  next();
};
