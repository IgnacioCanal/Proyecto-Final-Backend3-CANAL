import { cartsController } from "../controllers/carts.controller.js";
import { cartService } from "../services/carts.service.js";
import { productsService } from "../services/products.service.js";
import { ticketService } from "../services/ticket.service.js";
import { NotFoundError, ValidationError } from "../utils/customErrors.js";


jest.mock("../services/carts.service.js");
jest.mock("../services/products.service.js");
jest.mock("../services/ticket.service.js");

describe("CartsController", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: {},
      body: {},
      user: { email: "test@example.com" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("getAll", () => {
    test("debería devolver todos los carritos", async () => {
      const mockCarts = [
        { _id: "123", products: [] },
        { _id: "124", products: [{ product: "prod1", quantity: 1 }] },
      ];
      cartService.getAllCarts.mockResolvedValue(mockCarts);

      await cartsController.getAll(req, res, next);

      expect(cartService.getAllCarts).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockCarts);
      expect(res.status).not.toHaveBeenCalled();
    });

    test("debería propagar errores al errorHandler", async () => {
      const error = new Error("Error en la base de datos");
      cartService.getAllCarts.mockRejectedValue(error);

      await cartsController.getAll(req, res, next);

      expect(cartService.getAllCarts).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    test("debería devolver un carrito si existe", async () => {
      const mockCart = { _id: "123", products: [{ product: "prod1", quantity: 2 }] };
      req.params.cartId = "123";
      cartService.getCartById.mockResolvedValue(mockCart);

      await cartsController.getById(req, res, next);

      expect(cartService.getCartById).toHaveBeenCalledWith("123");
      expect(res.json).toHaveBeenCalledWith(mockCart);
      expect(res.status).not.toHaveBeenCalled();
    });

    test("debería devolver 404 si el carrito no existe", async () => {
      req.params.cartId = "123";
      cartService.getCartById.mockResolvedValue(null);

      await cartsController.getById(req, res, next);

      expect(cartService.getCartById).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Carrito no encontrado" });
    });

    test("debería propagar NotFoundError al errorHandler", async () => {
      req.params.cartId = "123";
      const error = new NotFoundError("Carrito no encontrado");
      cartService.getCartById.mockRejectedValue(error);

      await cartsController.getById(req, res, next);

      expect(cartService.getCartById).toHaveBeenCalledWith("123");
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test("debería propagar ValidationError al errorHandler", async () => {
      req.params.cartId = undefined;
      const error = new ValidationError("Falta el ID del carrito");
      cartService.getCartById.mockRejectedValue(error);

      await cartsController.getById(req, res, next);

      expect(cartService.getCartById).toHaveBeenCalledWith(undefined);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    test("debería crear un nuevo carrito", async () => {
      const mockCart = { _id: "123", products: [] };
      cartService.createCart.mockResolvedValue(mockCart);

      await cartsController.create(req, res, next);

      expect(cartService.createCart).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCart);
    });

    test("debería propagar errores al errorHandler", async () => {
      const error = new Error("Error en la base de datos");
      cartService.createCart.mockRejectedValue(error);

      await cartsController.create(req, res, next);

      expect(cartService.createCart).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("addProductToCart", () => {
    test("debería agregar un producto al carrito", async () => {
      req.params.cartId = "123";
      req.params.productId = "prod1";
      const mockProduct = { _id: "prod1", nombre: "Producto 1", precio: 100, stock: 10 };
      const mockCart = { _id: "123", products: [{ product: "prod1", quantity: 1 }] };
      productsService.getById.mockResolvedValue(mockProduct);
      cartService.addProductToCart.mockResolvedValue(mockCart);

      await cartsController.addProductToCart(req, res, next);

      expect(productsService.getById).toHaveBeenCalledWith("prod1");
      expect(cartService.addProductToCart).toHaveBeenCalledWith("123", "prod1");
      expect(res.json).toHaveBeenCalledWith(mockCart);
      expect(res.status).not.toHaveBeenCalled();
    });

    test("debería devolver 400 si el producto no existe", async () => {
      req.params.cartId = "123";
      req.params.productId = "prod1";
      productsService.getById.mockResolvedValue(null);

      await cartsController.addProductToCart(req, res, next);

      expect(productsService.getById).toHaveBeenCalledWith("prod1");
      expect(cartService.addProductToCart).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Producto no encontrado" });
    });

    test("debería propagar NotFoundError al errorHandler", async () => {
      req.params.cartId = "123";
      req.params.productId = "prod1";
      const mockProduct = { _id: "prod1", nombre: "Producto 1", precio: 100, stock: 10 };
      const error = new NotFoundError("Carrito no encontrado");
      productsService.getById.mockResolvedValue(mockProduct);
      cartService.addProductToCart.mockRejectedValue(error);

      await cartsController.addProductToCart(req, res, next);

      expect(productsService.getById).toHaveBeenCalledWith("prod1");
      expect(cartService.addProductToCart).toHaveBeenCalledWith("123", "prod1");
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("updateCart", () => {
    test("debería actualizar los productos del carrito", async () => {
      req.params.cartId = "123";
      req.body.products = [{ product: "prod1", quantity: 2 }];
      const mockCart = { _id: "123", products: [{ product: "prod1", quantity: 2 }] };
      cartService.updateCart.mockResolvedValue(mockCart);

      await cartsController.updateCart(req, res, next);

      expect(cartService.updateCart).toHaveBeenCalledWith("123", req.body.products);
      expect(res.json).toHaveBeenCalledWith(mockCart);
      expect(res.status).not.toHaveBeenCalled();
    });

    test("debería propagar NotFoundError al errorHandler", async () => {
      req.params.cartId = "123";
      req.body.products = [];
      const error = new NotFoundError("Carrito no encontrado");
      cartService.updateCart.mockRejectedValue(error);

      await cartsController.updateCart(req, res, next);

      expect(cartService.updateCart).toHaveBeenCalledWith("123", []);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("updateProductQuantity", () => {
    test("debería actualizar la cantidad de un producto", async () => {
      req.params.cartId = "123";
      req.params.productId = "prod1";
      req.body.quantity = 3;
      const mockCart = { _id: "123", products: [{ product: "prod1", quantity: 3 }] };
      cartService.updateProductQuantity.mockResolvedValue(mockCart);

      await cartsController.updateProductQuantity(req, res, next);

      expect(cartService.updateProductQuantity).toHaveBeenCalledWith("123", "prod1", 3);
      expect(res.json).toHaveBeenCalledWith(mockCart);
      expect(res.status).not.toHaveBeenCalled();
    });

    test("debería devolver 400 si la cantidad es inválida", async () => {
      req.params.cartId = "123";
      req.params.productId = "prod1";
      req.body.quantity = 0;

      await cartsController.updateProductQuantity(req, res, next);

      expect(cartService.updateProductQuantity).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "La cantidad debe ser un número entero positivo",
      });
    });

    test("debería propagar NotFoundError al errorHandler", async () => {
      req.params.cartId = "123";
      req.params.productId = "prod1";
      req.body.quantity = 2;
      const error = new NotFoundError("Carrito o producto no encontrado");
      cartService.updateProductQuantity.mockRejectedValue(error);

      await cartsController.updateProductQuantity(req, res, next);

      expect(cartService.updateProductQuantity).toHaveBeenCalledWith("123", "prod1", 2);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("removeProductFromCart", () => {
    test("debería eliminar un producto del carrito", async () => {
      req.params.cartId = "123";
      req.params.productId = "prod1";
      const mockCart = { _id: "123", products: [] };
      cartService.removeProductFromCart.mockResolvedValue(mockCart);

      await cartsController.removeProductFromCart(req, res, next);

      expect(cartService.removeProductFromCart).toHaveBeenCalledWith("123", "prod1");
      expect(res.json).toHaveBeenCalledWith(mockCart);
      expect(res.status).not.toHaveBeenCalled();
    });

    test("debería propagar NotFoundError al errorHandler", async () => {
      req.params.cartId = "123";
      req.params.productId = "prod1";
      const error = new NotFoundError("Carrito no encontrado");
      cartService.removeProductFromCart.mockRejectedValue(error);

      await cartsController.removeProductFromCart(req, res, next);

      expect(cartService.removeProductFromCart).toHaveBeenCalledWith("123", "prod1");
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("clearCart", () => {
    test("debería vaciar el carrito", async () => {
      req.params.cartId = "123";
      const mockCart = { _id: "123", products: [] };
      cartService.clearCart.mockResolvedValue(mockCart);

      await cartsController.clearCart(req, res, next);

      expect(cartService.clearCart).toHaveBeenCalledWith("123");
      expect(res.json).toHaveBeenCalledWith({
        message: "Todos los productos eliminados del carrito",
        clearedCart: mockCart,
      });
      expect(res.status).not.toHaveBeenCalled();
    });

    test("debería propagar NotFoundError al errorHandler", async () => {
      req.params.cartId = "123";
      const error = new NotFoundError("Carrito no encontrado");
      cartService.clearCart.mockRejectedValue(error);

      await cartsController.clearCart(req, res, next);

      expect(cartService.clearCart).toHaveBeenCalledWith("123");
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("purchase", () => {
    test("debería completar la compra con productos procesados", async () => {
      req.params.cartId = "123";
      const mockCart = {
        _id: "123",
        products: [{ product: { _id: "prod1" }, quantity: 2 }],
      };
      const mockProduct = { _id: "prod1", nombre: "Producto 1", precio: 100, stock: 5 };
      const mockTicket = { _id: "ticket1", amount: 200, purchaser: "test@example.com" };
      cartService.getCartById.mockResolvedValue(mockCart);
      productsService.getById.mockResolvedValue(mockProduct);
      productsService.update.mockResolvedValue(mockProduct);
      cartService.updateCart.mockResolvedValue(mockCart);
      ticketService.create.mockResolvedValue(mockTicket);

      await cartsController.purchase(req, res, next);

      expect(cartService.getCartById).toHaveBeenCalledWith("123");
      expect(productsService.getById).toHaveBeenCalledWith("prod1");
      expect(productsService.update).toHaveBeenCalledWith("prod1", { stock: 3 });
      expect(cartService.updateCart).toHaveBeenCalledWith("123", []);
      expect(ticketService.create).toHaveBeenCalledWith({
        amount: 200,
        purchaser: "test@example.com",
        products: [{ product: "prod1", quantity: 2 }],
        purchase_datetime: expect.any(Date),
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Compra finalizada",
        ticket: mockTicket,
        unprocessedProducts: undefined,
      });
    });

    test("debería devolver 400 si el carrito está vacío", async () => {
      req.params.cartId = "123";
      const mockCart = { _id: "123", products: [] };
      cartService.getCartById.mockResolvedValue(mockCart);

      await cartsController.purchase(req, res, next);

      expect(cartService.getCartById).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "El carrito está vacío o no existe",
      });
    });

    test("debería manejar productos no procesados por falta de stock", async () => {
      req.params.cartId = "123";
      const mockCart = {
        _id: "123",
        products: [
          { product: { _id: "prod1" }, quantity: 2 },
          { product: { _id: "prod2" }, quantity: 5 },
        ],
      };
      const mockProduct1 = { _id: "prod1", nombre: "Producto 1", precio: 100, stock: 5 };
      const mockProduct2 = { _id: "prod2", nombre: "Producto 2", precio: 50, stock: 3 };
      cartService.getCartById.mockResolvedValue(mockCart);
      productsService.getById
        .mockResolvedValueOnce(mockProduct1)
        .mockResolvedValueOnce(mockProduct2);
      productsService.update.mockResolvedValue(mockProduct1);
      cartService.updateCart.mockResolvedValue(mockCart);
      ticketService.create.mockResolvedValue({
        _id: "ticket1",
        amount: 200,
        purchaser: "test@example.com",
      });

      await cartsController.purchase(req, res, next);

      expect(cartService.getCartById).toHaveBeenCalledWith("123");
      expect(productsService.getById).toHaveBeenCalledWith("prod1");
      expect(productsService.getById).toHaveBeenCalledWith("prod2");
      expect(productsService.update).toHaveBeenCalledWith("prod1", { stock: 3 });
      expect(cartService.updateCart).toHaveBeenCalledWith("123", [
        { product: { _id: "prod2" }, quantity: 5 },
      ]);
      expect(ticketService.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Compra finalizada",
        ticket: expect.any(Object),
        unprocessedProducts: ["prod2"],
      });
    });

    test("debería devolver 400 si no se procesa ningún producto", async () => {
      req.params.cartId = "123";
      const mockCart = {
        _id: "123",
        products: [{ product: { _id: "prod1" }, quantity: 10 }],
      };
      const mockProduct = { _id: "prod1", nombre: "Producto 1", precio: 100, stock: 5 };
      cartService.getCartById.mockResolvedValue(mockCart);
      productsService.getById.mockResolvedValue(mockProduct);
      cartService.updateCart.mockResolvedValue(mockCart);

      await cartsController.purchase(req, res, next);

      expect(cartService.getCartById).toHaveBeenCalledWith("123");
      expect(productsService.getById).toHaveBeenCalledWith("prod1");
      expect(cartService.updateCart).toHaveBeenCalledWith("123", mockCart.products);
      expect(ticketService.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "No se pudo procesar ningún producto por falta de stock",
        unprocessedProducts: ["prod1"],
      });
    });

    test("debería propagar NotFoundError al errorHandler", async () => {
      req.params.cartId = "123";
      const error = new NotFoundError("Carrito no encontrado");
      cartService.getCartById.mockRejectedValue(error);

      await cartsController.purchase(req, res, next);

      expect(cartService.getCartById).toHaveBeenCalledWith("123");
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});