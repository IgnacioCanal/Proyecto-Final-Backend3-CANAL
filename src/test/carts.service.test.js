import { cartService } from "../services/carts.service.js";
import { cartDao } from "../DAOs/index.dao.js";
import { NotFoundError, ValidationError } from "../utils/customErrors.js";

jest.mock("../DAOs/index.dao.js");

describe("CartService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCart", () => {
    test("debería crear y devolver un nuevo carrito", async () => {
      const mockCart = { _id: "123", products: [] };
      cartDao.createCart.mockResolvedValue(mockCart);

      const result = await cartService.createCart();

      expect(cartDao.createCart).toHaveBeenCalled();
      expect(result).toEqual(mockCart);
    });

    test("debería lanzar un error si falla la creación", async () => {
      cartDao.createCart.mockRejectedValue(new Error("Error en la base de datos"));

      await expect(cartService.createCart()).rejects.toThrow("Error al crear carrito");
      expect(cartDao.createCart).toHaveBeenCalled();
    });
  });

  describe("getCartById", () => {
    test("debería devolver un carrito si existe", async () => {
      const mockCart = {
        _id: "123",
        products: [{ product: "prod1", quantity: 2 }],
      };
      cartDao.getCartById.mockResolvedValue(mockCart);

      const result = await cartService.getCartById("123");

      expect(cartDao.getCartById).toHaveBeenCalledWith("123");
      expect(result).toEqual(mockCart);
    });

    test("debería lanzar NotFoundError si el carrito no existe", async () => {
      cartDao.getCartById.mockResolvedValue(null);

      await expect(cartService.getCartById("123")).rejects.toMatchObject({
        name: "NotFoundError",
        status: 404,
        message: "Carrito no encontrado",
      });
      expect(cartDao.getCartById).toHaveBeenCalledWith("123");
    });

    test("debería lanzar ValidationError si falta el cartId", async () => {
      await expect(cartService.getCartById()).rejects.toMatchObject({
        name: "ValidationError",
        status: 400,
        message: "Falta el ID del carrito",
      });
      expect(cartDao.getCartById).not.toHaveBeenCalled();
    });
  });

  describe("getAllCarts", () => {
    test("debería devolver todos los carritos", async () => {
      const mockCarts = [
        { _id: "123", products: [] },
        { _id: "124", products: [{ product: "prod1", quantity: 1 }] },
      ];
      cartDao.getAllCarts.mockResolvedValue(mockCarts);

      const result = await cartService.getAllCarts();

      expect(cartDao.getAllCarts).toHaveBeenCalled();
      expect(result).toEqual(mockCarts);
    });

    test("debería lanzar un error si falla la obtención", async () => {
      cartDao.getAllCarts.mockRejectedValue(new Error("Error en la base de datos"));

      await expect(cartService.getAllCarts()).rejects.toThrow("Error al obtener carritos");
      expect(cartDao.getAllCarts).toHaveBeenCalled();
    });
  });

  describe("addProductToCart", () => {
    test("debería agregar un producto al carrito", async () => {
      const mockCart = {
        _id: "123",
        products: [{ product: "prod1", quantity: 1 }],
      };
      cartDao.addProductToCart.mockResolvedValue(mockCart);

      const result = await cartService.addProductToCart("123", "prod1");

      expect(cartDao.addProductToCart).toHaveBeenCalledWith("123", "prod1");
      expect(result).toEqual(mockCart);
    });

    test("debería lanzar NotFoundError si el carrito no existe", async () => {
      cartDao.addProductToCart.mockResolvedValue(null);

      await expect(cartService.addProductToCart("123", "prod1")).rejects.toMatchObject({
        name: "NotFoundError",
        status: 404,
        message: "Carrito no encontrado",
      });
      expect(cartDao.addProductToCart).toHaveBeenCalledWith("123", "prod1");
    });

    test("debería lanzar ValidationError si falta cartId o productId", async () => {
      await expect(cartService.addProductToCart("123")).rejects.toMatchObject({
        name: "ValidationError",
        status: 400,
        message: "Falta el ID del carrito o del producto",
      });
      expect(cartDao.addProductToCart).not.toHaveBeenCalled();
    });
  });

  describe("updateProductQuantity", () => {
    test("debería actualizar la cantidad de un producto", async () => {
      const mockCart = {
        _id: "123",
        products: [{ product: "prod1", quantity: 3 }],
      };
      cartDao.updateProductQuantity.mockResolvedValue(mockCart);

      const result = await cartService.updateProductQuantity("123", "prod1", 3);

      expect(cartDao.updateProductQuantity).toHaveBeenCalledWith("123", "prod1", 3);
      expect(result).toEqual(mockCart);
    });

    test("debería lanzar NotFoundError si el carrito o producto no existe", async () => {
      cartDao.updateProductQuantity.mockResolvedValue(null);

      await expect(cartService.updateProductQuantity("123", "prod1", 2)).rejects.toMatchObject({
        name: "NotFoundError",
        status: 404,
        message: "Carrito o producto no encontrado",
      });
      expect(cartDao.updateProductQuantity).toHaveBeenCalledWith("123", "prod1", 2);
    });

    test("debería lanzar ValidationError si falta cartId o productId", async () => {
      await expect(cartService.updateProductQuantity("123")).rejects.toMatchObject({
        name: "ValidationError",
        status: 400,
        message: "Falta el ID del carrito o del producto",
      });
      expect(cartDao.updateProductQuantity).not.toHaveBeenCalled();
    });

    test("debería lanzar ValidationError si la cantidad es inválida", async () => {
      await expect(cartService.updateProductQuantity("123", "prod1", 0)).rejects.toMatchObject({
        name: "ValidationError",
        status: 400,
        message: "La cantidad debe ser un número entero positivo",
      });
      expect(cartDao.updateProductQuantity).not.toHaveBeenCalled();
    });
  });

  describe("removeProductFromCart", () => {
    test("debería eliminar un producto del carrito", async () => {
      const mockCart = {
        _id: "123",
        products: [],
      };
      cartDao.removeProductFromCart.mockResolvedValue(mockCart);

      const result = await cartService.removeProductFromCart("123", "prod1");

      expect(cartDao.removeProductFromCart).toHaveBeenCalledWith("123", "prod1");
      expect(result).toEqual(mockCart);
    });

    test("debería lanzar NotFoundError si el carrito no existe", async () => {
      cartDao.removeProductFromCart.mockResolvedValue(null);

      await expect(cartService.removeProductFromCart("123", "prod1")).rejects.toMatchObject({
        name: "NotFoundError",
        status: 404,
        message: "Carrito no encontrado",
      });
      expect(cartDao.removeProductFromCart).toHaveBeenCalledWith("123", "prod1");
    });

    test("debería lanzar ValidationError si falta cartId o productId", async () => {
      await expect(cartService.removeProductFromCart("123")).rejects.toMatchObject({
        name: "ValidationError",
        status: 400,
        message: "Falta el ID del carrito o del producto",
      });
      expect(cartDao.removeProductFromCart).not.toHaveBeenCalled();
    });
  });

  describe("updateCart", () => {
    test("debería actualizar los productos del carrito", async () => {
      const mockCart = {
        _id: "123",
        products: [{ product: "prod1", quantity: 2 }],
      };
      const newProducts = [{ product: "prod1", quantity: 2 }];
      cartDao.updateCart.mockResolvedValue(mockCart);

      const result = await cartService.updateCart("123", newProducts);

      expect(cartDao.updateCart).toHaveBeenCalledWith("123", newProducts);
      expect(result).toEqual(mockCart);
    });

    test("debería lanzar NotFoundError si el carrito no existe", async () => {
      cartDao.updateCart.mockResolvedValue(null);

      await expect(cartService.updateCart("123", [])).rejects.toMatchObject({
        name: "NotFoundError",
        status: 404,
        message: "Carrito no encontrado",
      });
      expect(cartDao.updateCart).toHaveBeenCalledWith("123", []);
    });

    test("debería lanzar ValidationError si falta cartId", async () => {
      await expect(cartService.updateCart(undefined, [])).rejects.toMatchObject({
        name: "ValidationError",
        status: 400,
        message: "Falta el ID del carrito",
      });
      expect(cartDao.updateCart).not.toHaveBeenCalled();
    });

    test("debería lanzar ValidationError si products no es un array", async () => {
      await expect(cartService.updateCart("123", "no-array")).rejects.toMatchObject({
        name: "ValidationError",
        status: 400,
        message: "Los productos deben ser un array",
      });
      expect(cartDao.updateCart).not.toHaveBeenCalled();
    });
  });

  describe("clearCart", () => {
    test("debería vaciar el carrito", async () => {
      const mockCart = { _id: "123", products: [] };
      cartDao.clearCart.mockResolvedValue(mockCart);

      const result = await cartService.clearCart("123");

      expect(cartDao.clearCart).toHaveBeenCalledWith("123");
      expect(result).toEqual(mockCart);
    });

    test("debería lanzar NotFoundError si el carrito no existe", async () => {
      cartDao.clearCart.mockResolvedValue(null);

      await expect(cartService.clearCart("123")).rejects.toMatchObject({
        name: "NotFoundError",
        status: 404,
        message: "Carrito no encontrado",
      });
      expect(cartDao.clearCart).toHaveBeenCalledWith("123");
    });

    test("debería lanzar ValidationError si falta el cartId", async () => {
      await expect(cartService.clearCart()).rejects.toMatchObject({
        name: "ValidationError",
        status: 400,
        message: "Falta el ID del carrito",
      });
      expect(cartDao.clearCart).not.toHaveBeenCalled();
    });
  });
});