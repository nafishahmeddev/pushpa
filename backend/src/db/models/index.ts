import { Product } from "./product/product";
import { Restaurant } from "./restaurant/restaurant";
import { Table } from "./restaurant/table";
import { Order } from "./order/order";
import { OrderItem } from "./order/order-item";
import { ProductCategory } from "./product/product-category";
import { Cart } from "./cart/cart";
import { CartItem } from "./cart/cart-item";
import { Sequence } from "./sequence";
import { User } from "./user/user";
import { Kot } from "./kot/kot";
import { KotItem } from "./kot/kot-item";
import { Location } from "./restaurant/location";

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

//location
Location.belongsTo(Restaurant, {
  targetKey: "id",
  foreignKey: "restaurantId",
  as: "restaurant",
});

//table
Table.belongsTo(Location, {
  targetKey: "id",
  foreignKey: "locationId",
  as: "location",
});

//Cart
Cart.belongsTo(Restaurant, {
  targetKey: "id",
  foreignKey: "restaurantId",
  as: "restaurant"
})

Cart.belongsTo(Table, {
  foreignKey: "tableId",
  as: "table"
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
  onDelete: "CASCADE"
})

CartItem.belongsTo(Product, {
  targetKey: "id",
  foreignKey: "productId",
  as: "product",
  onDelete: "CASCADE"
});

//order
Order.belongsTo(Restaurant, {
  targetKey: "id",
  foreignKey: "restaurantId",
  as: "restaurant",
});

Order.belongsTo(Table, {
  foreignKey: "tableId",
  as: "table"
})

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "items",
});

//order item
OrderItem.belongsTo(Order, {
  targetKey: "id",
  foreignKey: "orderId",
  as: "order",
  onDelete: "CASCADE"
});

//Kot
Kot.belongsTo(Table, {
  targetKey: "id",
  foreignKey: "tableId",
  as: "table"
});

Kot.hasMany(KotItem, {
  foreignKey: "kotId",
  as: "items"
})

KotItem.belongsTo(Kot, {
  targetKey: "id",
  foreignKey: "kotId",
  as: "kot"
})

KotItem.belongsTo(Product, {
  targetKey: "id",
  foreignKey: "productId",
  as: "product"
})

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
  Order,
  OrderItem,
  Cart,
  CartItem,
  Sequence,
  User,
  Location
};
