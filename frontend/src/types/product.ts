export type ICategory = {
    id: string,
    name: string,
    products?: Array<IProduct>,
    createdAt: Date,
    updatedAt: Date,
}

export type IProduct = {
    id: string,
    name: string,
    image: string,
    description: string,
    price: number,
    tax: number,
    categoryId: string,
    category?: ICategory,
    createdAt: Date,
    updatedAt: Date,
}