import { IRestaurant } from "./restaurant";

export type ILocation = {
    id: string,
    name: string,
    restaurantId: string,
    restaurant?: IRestaurant,
    createdAt: Date,
    updatedAt: Date,
}