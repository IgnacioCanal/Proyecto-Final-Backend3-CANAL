import path from "path";
import morgan from "morgan";
import express from "express";
import { createServer } from "http";
import exphbs from "express-handlebars";
import { mongodbProvider } from "./config/mongodbProvider.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import jwt from "jsonwebtoken";
import { userModel } from "./models/user.model.js";
import cors from "cors";

import { __dirname } from "./dirname.js";
import { CONFIG } from "./config/config.js";
import { PERSISTENCE } from "./common/constants/persistence.js";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { viewsRoutes } from "./routes/views.routes.js";
import { sessionRouter } from "./routes/session.routes.js";
import { initSocket } from "./socket.js";
import { authRouter } from "./routes/auth.routes.js";
import { cartService } from "./services/carts.service.js";
import { mocksRouter } from "./routes/mocks.router.js";
import { usersRouter } from "./routes/users.router.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { getLogger } from "./utils/logger.js";
import { loggerRouter } from "./routes/logger.routes.js";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();
const logger = getLogger();

export const SECRET = "clavesecreta";

const hbs = exphbs.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "views", "layout"),
  partialsDir: path.join(__dirname, "views", "partials"),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

hbs.handlebars.registerHelper("multiply", (a, b) => a * b);
hbs.handlebars.registerHelper("eq", function(a, b) { return a === b; });
hbs.handlebars.registerHelper("formatDate", function(date) {
  const dateObj = date instanceof Date ? date : new Date(date);
  if (!dateObj || isNaN(new Date(dateObj))) {
    return "Fecha no disponible";
  }
  const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return new Date(date).toLocaleDateString("es-ES", options);
});
hbs.handlebars.registerHelper("array", function(item) {
  return [item];
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

const startServer = async () => {

  if (CONFIG.PERSISTENCE === PERSISTENCE.MONGODB) {
    try {
      await mongodbProvider.connect(CONFIG.MONGO_URI);
    } catch (error) {
      logger.error("Failed to start server due to MongoDB connection error:", error);
      process.exit(1);
    }
  } else if (CONFIG.PERSISTENCE === PERSISTENCE.MEMORY) {
    logger.info("Using in-memory persistence");
  }

  initializePassport();
  app.use(passport.initialize());

  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.resolve(__dirname, "../public")));
  app.use(cookieParser());
  app.use(cors());

  app.use(async (req, res, next) => {
    if (req.cookies.token) {
      try {
        const decoded = jwt.verify(req.cookies.token, SECRET);
        const user = await userModel.findById(decoded._id).lean();
        if (user) {
        user.cartId = user.cartId ? user.cartId.toString() : null;
        req.user = user;
        res.locals.currentUser = user;
        if (user && user.role !== "admin") {
          const cart = await cartService.getCartById(user.cartId);
          res.locals.cartCount = cart ? cart.products.reduce((acc, item) => acc + item.quantity, 0) : 0;
        } else {
          res.locals.cartCount = 0;
        }
      } else {
        req.user = null;
        res.locals.currentUser = null;
        res.locals.cartCount = 0;
      }
      } catch (error) {
        logger.error("Error en middleware de autenticación:", error);
        req.user = null;
        res.locals.currentUser = null;
        res.locals.cartCount = 0;
      }
    } else {
      req.user= null;
      res.locals.currentUser = null;
      res.locals.cartCount = 0;
    }
    next();
  });

  app.use((req, res, next) => {
    logger.http(`${req.method} ${req.url}`);
    next();
  });

  app.use("/", viewsRoutes);
  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);
  app.use("/api/sessions", sessionRouter);
  app.use("/", authRouter);
  app.use('/api/logger', loggerRouter);
  app.use('/api/mocks', mocksRouter);
  app.use('/api/users', usersRouter);

  app.use(errorHandler);

  const server = createServer(app);
  initSocket(server);



  server.listen(CONFIG.PORT, () => {
    logger.info(`Server running on port http://localhost:${CONFIG.PORT}`);
  });
};


if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;