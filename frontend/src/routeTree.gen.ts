/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SettingsImport } from './routes/settings'
import { Route as PosImport } from './routes/pos'
import { Route as IndexImport } from './routes/index'
import { Route as UsersIndexImport } from './routes/users/index'
import { Route as PosIndexImport } from './routes/pos/index'
import { Route as OrdersIndexImport } from './routes/orders/index'
import { Route as InvoicesIndexImport } from './routes/invoices/index'
import { Route as PosOrderIdImport } from './routes/pos/$orderId'
import { Route as AuthLoginImport } from './routes/auth/login'
import { Route as SettingsTablesIndexImport } from './routes/settings/tables/index'
import { Route as SettingsProductsIndexImport } from './routes/settings/products/index'
import { Route as SettingsLocationsIndexImport } from './routes/settings/locations/index'
import { Route as SettingsCategoriesIndexImport } from './routes/settings/categories/index'

// Create/Update Routes

const SettingsRoute = SettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => rootRoute,
} as any)

const PosRoute = PosImport.update({
  id: '/pos',
  path: '/pos',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const UsersIndexRoute = UsersIndexImport.update({
  id: '/users/',
  path: '/users/',
  getParentRoute: () => rootRoute,
} as any)

const PosIndexRoute = PosIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => PosRoute,
} as any)

const OrdersIndexRoute = OrdersIndexImport.update({
  id: '/orders/',
  path: '/orders/',
  getParentRoute: () => rootRoute,
} as any)

const InvoicesIndexRoute = InvoicesIndexImport.update({
  id: '/invoices/',
  path: '/invoices/',
  getParentRoute: () => rootRoute,
} as any)

const PosOrderIdRoute = PosOrderIdImport.update({
  id: '/$orderId',
  path: '/$orderId',
  getParentRoute: () => PosRoute,
} as any)

const AuthLoginRoute = AuthLoginImport.update({
  id: '/auth/login',
  path: '/auth/login',
  getParentRoute: () => rootRoute,
} as any)

const SettingsTablesIndexRoute = SettingsTablesIndexImport.update({
  id: '/tables/',
  path: '/tables/',
  getParentRoute: () => SettingsRoute,
} as any)

const SettingsProductsIndexRoute = SettingsProductsIndexImport.update({
  id: '/products/',
  path: '/products/',
  getParentRoute: () => SettingsRoute,
} as any)

const SettingsLocationsIndexRoute = SettingsLocationsIndexImport.update({
  id: '/locations/',
  path: '/locations/',
  getParentRoute: () => SettingsRoute,
} as any)

const SettingsCategoriesIndexRoute = SettingsCategoriesIndexImport.update({
  id: '/categories/',
  path: '/categories/',
  getParentRoute: () => SettingsRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/pos': {
      id: '/pos'
      path: '/pos'
      fullPath: '/pos'
      preLoaderRoute: typeof PosImport
      parentRoute: typeof rootRoute
    }
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsImport
      parentRoute: typeof rootRoute
    }
    '/auth/login': {
      id: '/auth/login'
      path: '/auth/login'
      fullPath: '/auth/login'
      preLoaderRoute: typeof AuthLoginImport
      parentRoute: typeof rootRoute
    }
    '/pos/$orderId': {
      id: '/pos/$orderId'
      path: '/$orderId'
      fullPath: '/pos/$orderId'
      preLoaderRoute: typeof PosOrderIdImport
      parentRoute: typeof PosImport
    }
    '/invoices/': {
      id: '/invoices/'
      path: '/invoices'
      fullPath: '/invoices'
      preLoaderRoute: typeof InvoicesIndexImport
      parentRoute: typeof rootRoute
    }
    '/orders/': {
      id: '/orders/'
      path: '/orders'
      fullPath: '/orders'
      preLoaderRoute: typeof OrdersIndexImport
      parentRoute: typeof rootRoute
    }
    '/pos/': {
      id: '/pos/'
      path: '/'
      fullPath: '/pos/'
      preLoaderRoute: typeof PosIndexImport
      parentRoute: typeof PosImport
    }
    '/users/': {
      id: '/users/'
      path: '/users'
      fullPath: '/users'
      preLoaderRoute: typeof UsersIndexImport
      parentRoute: typeof rootRoute
    }
    '/settings/categories/': {
      id: '/settings/categories/'
      path: '/categories'
      fullPath: '/settings/categories'
      preLoaderRoute: typeof SettingsCategoriesIndexImport
      parentRoute: typeof SettingsImport
    }
    '/settings/locations/': {
      id: '/settings/locations/'
      path: '/locations'
      fullPath: '/settings/locations'
      preLoaderRoute: typeof SettingsLocationsIndexImport
      parentRoute: typeof SettingsImport
    }
    '/settings/products/': {
      id: '/settings/products/'
      path: '/products'
      fullPath: '/settings/products'
      preLoaderRoute: typeof SettingsProductsIndexImport
      parentRoute: typeof SettingsImport
    }
    '/settings/tables/': {
      id: '/settings/tables/'
      path: '/tables'
      fullPath: '/settings/tables'
      preLoaderRoute: typeof SettingsTablesIndexImport
      parentRoute: typeof SettingsImport
    }
  }
}

// Create and export the route tree

interface PosRouteChildren {
  PosOrderIdRoute: typeof PosOrderIdRoute
  PosIndexRoute: typeof PosIndexRoute
}

const PosRouteChildren: PosRouteChildren = {
  PosOrderIdRoute: PosOrderIdRoute,
  PosIndexRoute: PosIndexRoute,
}

const PosRouteWithChildren = PosRoute._addFileChildren(PosRouteChildren)

interface SettingsRouteChildren {
  SettingsCategoriesIndexRoute: typeof SettingsCategoriesIndexRoute
  SettingsLocationsIndexRoute: typeof SettingsLocationsIndexRoute
  SettingsProductsIndexRoute: typeof SettingsProductsIndexRoute
  SettingsTablesIndexRoute: typeof SettingsTablesIndexRoute
}

const SettingsRouteChildren: SettingsRouteChildren = {
  SettingsCategoriesIndexRoute: SettingsCategoriesIndexRoute,
  SettingsLocationsIndexRoute: SettingsLocationsIndexRoute,
  SettingsProductsIndexRoute: SettingsProductsIndexRoute,
  SettingsTablesIndexRoute: SettingsTablesIndexRoute,
}

const SettingsRouteWithChildren = SettingsRoute._addFileChildren(
  SettingsRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/pos': typeof PosRouteWithChildren
  '/settings': typeof SettingsRouteWithChildren
  '/auth/login': typeof AuthLoginRoute
  '/pos/$orderId': typeof PosOrderIdRoute
  '/invoices': typeof InvoicesIndexRoute
  '/orders': typeof OrdersIndexRoute
  '/pos/': typeof PosIndexRoute
  '/users': typeof UsersIndexRoute
  '/settings/categories': typeof SettingsCategoriesIndexRoute
  '/settings/locations': typeof SettingsLocationsIndexRoute
  '/settings/products': typeof SettingsProductsIndexRoute
  '/settings/tables': typeof SettingsTablesIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/settings': typeof SettingsRouteWithChildren
  '/auth/login': typeof AuthLoginRoute
  '/pos/$orderId': typeof PosOrderIdRoute
  '/invoices': typeof InvoicesIndexRoute
  '/orders': typeof OrdersIndexRoute
  '/pos': typeof PosIndexRoute
  '/users': typeof UsersIndexRoute
  '/settings/categories': typeof SettingsCategoriesIndexRoute
  '/settings/locations': typeof SettingsLocationsIndexRoute
  '/settings/products': typeof SettingsProductsIndexRoute
  '/settings/tables': typeof SettingsTablesIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/pos': typeof PosRouteWithChildren
  '/settings': typeof SettingsRouteWithChildren
  '/auth/login': typeof AuthLoginRoute
  '/pos/$orderId': typeof PosOrderIdRoute
  '/invoices/': typeof InvoicesIndexRoute
  '/orders/': typeof OrdersIndexRoute
  '/pos/': typeof PosIndexRoute
  '/users/': typeof UsersIndexRoute
  '/settings/categories/': typeof SettingsCategoriesIndexRoute
  '/settings/locations/': typeof SettingsLocationsIndexRoute
  '/settings/products/': typeof SettingsProductsIndexRoute
  '/settings/tables/': typeof SettingsTablesIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/pos'
    | '/settings'
    | '/auth/login'
    | '/pos/$orderId'
    | '/invoices'
    | '/orders'
    | '/pos/'
    | '/users'
    | '/settings/categories'
    | '/settings/locations'
    | '/settings/products'
    | '/settings/tables'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/settings'
    | '/auth/login'
    | '/pos/$orderId'
    | '/invoices'
    | '/orders'
    | '/pos'
    | '/users'
    | '/settings/categories'
    | '/settings/locations'
    | '/settings/products'
    | '/settings/tables'
  id:
    | '__root__'
    | '/'
    | '/pos'
    | '/settings'
    | '/auth/login'
    | '/pos/$orderId'
    | '/invoices/'
    | '/orders/'
    | '/pos/'
    | '/users/'
    | '/settings/categories/'
    | '/settings/locations/'
    | '/settings/products/'
    | '/settings/tables/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  PosRoute: typeof PosRouteWithChildren
  SettingsRoute: typeof SettingsRouteWithChildren
  AuthLoginRoute: typeof AuthLoginRoute
  InvoicesIndexRoute: typeof InvoicesIndexRoute
  OrdersIndexRoute: typeof OrdersIndexRoute
  UsersIndexRoute: typeof UsersIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  PosRoute: PosRouteWithChildren,
  SettingsRoute: SettingsRouteWithChildren,
  AuthLoginRoute: AuthLoginRoute,
  InvoicesIndexRoute: InvoicesIndexRoute,
  OrdersIndexRoute: OrdersIndexRoute,
  UsersIndexRoute: UsersIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/pos",
        "/settings",
        "/auth/login",
        "/invoices/",
        "/orders/",
        "/users/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/pos": {
      "filePath": "pos.tsx",
      "children": [
        "/pos/$orderId",
        "/pos/"
      ]
    },
    "/settings": {
      "filePath": "settings.tsx",
      "children": [
        "/settings/categories/",
        "/settings/locations/",
        "/settings/products/",
        "/settings/tables/"
      ]
    },
    "/auth/login": {
      "filePath": "auth/login.tsx"
    },
    "/pos/$orderId": {
      "filePath": "pos/$orderId.tsx",
      "parent": "/pos"
    },
    "/invoices/": {
      "filePath": "invoices/index.tsx"
    },
    "/orders/": {
      "filePath": "orders/index.tsx"
    },
    "/pos/": {
      "filePath": "pos/index.tsx",
      "parent": "/pos"
    },
    "/users/": {
      "filePath": "users/index.tsx"
    },
    "/settings/categories/": {
      "filePath": "settings/categories/index.tsx",
      "parent": "/settings"
    },
    "/settings/locations/": {
      "filePath": "settings/locations/index.tsx",
      "parent": "/settings"
    },
    "/settings/products/": {
      "filePath": "settings/products/index.tsx",
      "parent": "/settings"
    },
    "/settings/tables/": {
      "filePath": "settings/tables/index.tsx",
      "parent": "/settings"
    }
  }
}
ROUTE_MANIFEST_END */
