import { Server } from "socket.io";
import { productsService } from "./services/products.service.js"; 
import { getLogger } from "./utils/logger.js";

const logger = getLogger();

export let io;

export const initSocket = (server) => {
  io = new Server(server);

  io.on("connection", (socket) => {
    logger.info("Nuevo cliente conectado:", socket.id);


    socket.emit("init", productsService.getAll().docs);


    socket.on("agregarProducto", async (product) => {
      try {
        await productsService.addProduct(product);
        const productosActualizados = await productsService.getAll({ page: 1 });
        const totalPages = productosActualizados.totalPages;
        const productosUltimaPagina = await productsService.getAll({
          page: totalPages,
        });
        io.emit("actualizarProductos", productosUltimaPagina, totalPages);
      } catch (error) {
        logger.error("Error al agregar producto:", error.message);
        socket.emit("error", error.message);
      }
    });


    socket.on("eliminarProducto", async ({ nombre, currentPage }) => {
      try {
        await productsService.deleteProduct(nombre);
        const productosActualizados = await productsService.getAll({
          page: currentPage,
        });
        io.emit(
          "actualizarProductos",
          productosActualizados,
          productosActualizados.totalPages
        );
      } catch (error) {
        logger.error("Error al eliminar producto:", error.message);
        socket.emit("error", error.message);
      }
    });
  });
};