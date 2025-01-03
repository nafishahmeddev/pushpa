import { IRestaurant } from "./restaurant"

export enum UserDesignation {
    Admin = "Admin",
    Biller = "Biller"
}

export type IUser = {
    id: string,
    email: string,
    phone: string,
    designation: UserDesignation,
    password: string,
    name: string,
    permissions: Array<string>,
    restaurant?: IRestaurant,
    createdAt: Date,
    updatedAt: Date,
    loggedAt: Date
}