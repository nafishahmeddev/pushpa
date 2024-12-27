export type IUser = {
    id: string,
    email: string,
    phone: string,
    designation: string,
    password: string,
    name: string,
    permissions: Array<string>,
    createdAt: Date,
    updatedAt: Date,
    loggedAt: Date
}