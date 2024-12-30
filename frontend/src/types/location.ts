import { IRestaurant } from "./restaurant";
import { ITable } from "./table";

export type ILocation = {
    id: string,
    name: string,
    restaurantId: string,
    restaurant?: IRestaurant,
    tables?: Array<ITable>,
    createdAt: Date,
    updatedAt: Date,
}