import { ILocation } from "./location"

export type ITable = {
    id: string,
    name: string,
    locationId: string,
    location?:ILocation,
    capacity: number,
    status: string,
    createdAt: Date,
    updatedAt: Date,
}