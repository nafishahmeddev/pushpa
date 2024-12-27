import { Product } from "./product/product";
import { Restaurant } from "./restaurant";
import { Table } from "./table/table";
import { Order } from "./order/order";
import { OrderItem } from "./order/order-item";
import { TableItem } from "./table/table-item";
import { ProductCategory } from "./product/product-category";
import { Cart } from "./cart/cart";
import { CartItem } from "./cart/cart-item";
import { Sequence } from "./sequence";
import { User } from "./user/user";

//restaurant associations
Restaurant.hasMany(ProductCategory, {
  foreignKey: "restaurantId",
  as: "categories",
});

Sequence.belongsTo(Restaurant, {
  targetKey: "id",
  foreignKey: "restaurantId",
  as: "restaurant"
})

//category associations
ProductCategory.belongsTo(Restaurant, {
  targetKey: "id",
  foreignKey: "restaurantId",
  as: "restaurant",
});

//
ProductCategory.hasMany(Product, {
  foreignKey: "categoryId",
  as: "products",
});

//
Product.belongsTo(ProductCategory, {
  targetKey: "id",
  foreignKey: "categoryId",
  as: "category",
});

//table
Table.belongsTo(Restaurant, {
  targetKey: "id",
  foreignKey: "restaurantId",
  as: "restaurant",
});

Table.hasMany(Order, {
  foreignKey: "tableId",
  as: "orders",
});

Table.hasMany(TableItem, {
  foreignKey: "tableId",
  as: "items",
});

//table item
TableItem.belongsTo(Table, {
  targetKey: "id",
  foreignKey: "tableId",
  as: "table",
});
TableItem.belongsTo(Product, {
  targetKey: "id",
  foreignKey: "productId",
  as: "product",
});

//Cart
Cart.belongsTo(Restaurant, {
  targetKey: "id",
  foreignKey: "restaurantId",
  as: "restaurant"
})

Cart.hasMany(CartItem, {
  foreignKey: "cartId",
  as: "items",
})

//cart item
CartItem.belongsTo(Cart, {
  targetKey: "id",
  foreignKey: "cartId",
  as: "cart",
})

CartItem.belongsTo(Product, {
  targetKey: "id",
  foreignKey: "productId",
  as: "product",
});

//order
Order.belongsTo(Restaurant, {
  targetKey: "id",
  foreignKey: "restaurantId",
  as: "restaurant",
});

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "items",
});

//order item
OrderItem.belongsTo(Order, {
  targetKey: "id",
  foreignKey: "orderId",
  as: "order",
});

//User 
User.belongsTo(Restaurant, {
  targetKey: "id",
  foreignKey: "restaurantId",
  as: "restaurant"
})
export {
  ProductCategory,
  Product,
  Restaurant,
  Table,
  TableItem,
  Order,
  OrderItem,
  Cart,
  CartItem,
  Sequence,
  User
};
