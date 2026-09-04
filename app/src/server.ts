// app/src/server.ts

/**
 * Se encarga únicamente de configurar la aplicación Express: middlewares, rutas, swagger, etc.
 * No arranca el servidor ni toca la base de datos.
 * Esto hace que la aplicación sea testeable fácilmente, porque podemos importar app en nuestros tests sin necesidad de levantar el servidor real ni conectarse a la BD.
*/

import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import cors from "cors";
import { corsOptions } from "./config/cors";
import userRoutes from "./routes/user.routes";
import movieRoutes from "./routes/movie.routes";
import countryRoutes from "./routes/country.routes";
import departmentRoutes from "./routes/department.routes";
import cityRoutes from "./routes/city.routes";
import authRoutes from './routes/auth.routes';
import cinemaComplexRoutes from "./routes/cinema.complex.routes";
import functionRoutes from "./routes/function.routes";
import reservationRoutes from "./routes/seat-reservation.routes";
import profileRoutes from "./routes/profile.routes";
import membershipRoutes from "./routes/membership.routes";

const app = express();
app.use(cors(corsOptions));


app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/cities", cityRoutes);
app.use('/auth', authRoutes);
app.use("/api/complex", cinemaComplexRoutes);
app.use("/api/functions", functionRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/membership", membershipRoutes);


// Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;