export type PaginationResponse<IRecord> = {
    pages: number;
    page: number;
    count: number;
    records: Array<IRecord>;
}