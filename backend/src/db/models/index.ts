import { Product } from "./product/product";
import { Restaurant } from "./restaurant/restaurant";
import { Table } from "./restaurant/table";
import { ProductCategory } from "./product/product-category";
import { Sequence } from "./sequence";
import { User } from "./user/user";
import { Kot } from "./order/kot";
import { Location } from "./restaurant/location";
import { Invoice } from "./invoice/invoice";
import { InvoiceItem } from "./invoice/invoice-item";
import { Order } from "./order/order";
import { OrderItem } from "./order/order-item";

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

Location.hasMany(Table, {
  foreignKey: "locationId",
  as: "tables",
});

//table
Table.belongsTo(Location, {
  targetKey: "id",
  foreignKey: "locationId",
  as: "location",
});

//Order
Order.belongsTo(Restaurant, {
  targetKey: "id",
  foreignKey: "restaurantId",
  as: "restaurant"
})

Order.belongsTo(Table, {
  foreignKey: "tableId",
  as: "table"
})


Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "items",
})

//order item
OrderItem.belongsTo(Order, {
  targetKey: "id",
  foreignKey: "orderId",
  as: "order",
  onDelete: "CASCADE"
})

OrderItem.belongsTo(Product, {
  targetKey: "id",
  foreignKey: "productId",
  as: "product",
  onDelete: "CASCADE"
});

//invoice
Invoice.belongsTo(Restaurant, {
  targetKey: "id",
  foreignKey: "restaurantId",
  as: "restaurant",
});

Invoice.belongsTo(Table, {
  foreignKey: "tableId",
  as: "table"
})

Invoice.hasMany(InvoiceItem, {
  foreignKey: "invoiceId",
  as: "items",
});

//invoice item
InvoiceItem.belongsTo(Invoice, {
  targetKey: "id",
  foreignKey: "invoiceId",
  as: "invoice",
  onDelete: "CASCADE"
});

//Kot
Kot.belongsTo(Order, {
  targetKey: "id",
  foreignKey: "orderId",
  as: "order"
});

Kot.hasMany(OrderItem, {
  foreignKey: "kotId",
  as: "items"
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
  Invoice,
  InvoiceItem,
  Order,
  OrderItem,
  Sequence,
  User,
  Location
};
