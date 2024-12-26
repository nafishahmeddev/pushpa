import { ApiRequest } from "@app/lib/axios"
import { ITable } from "@app/types/table"

export const getTables = () =>  ApiRequest.get("/tables").then(res=>res.data.result as Array<ITable>);