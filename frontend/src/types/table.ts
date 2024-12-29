import { IRestaurant } from "./restaurant"

export type ITable = {
    id: string,
    name: string,
    capacity: number,
    status: string,
    restaurantId: string,
    restaurant?: IRestaurant,
    createdAt: Date,
    updatedAt: Date,
}