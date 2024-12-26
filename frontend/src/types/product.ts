export type ICategory = {
    id: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
}

export type IProduct = {
    id: string,
    name: string,
    netPrice: number,
    price: number,
    cgst: number,
    sgst: number,
    categoryId: string,
    category?: ICategory,
    createdAt: Date,
    updatedAt: Date,
}