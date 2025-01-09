import React from "react";
import { Icon } from "@iconify/react";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "./table/Table";
import Pagination from "./Pagination";

type ValueTypes = string | Date | number | boolean;
type RecordType = { [key: string]: ValueTypes };
export type ColumnType =
  | "date"
  | "datetime"
  | "time"
  | "string"
  | "amount"
  | "number";
export type Column<IRecord> = {
  key: keyof IRecord;
  label: string;
  sortable: boolean;
  type: ColumnType;
  renderColumn: (
    value: ValueTypes,
    extra: { record: IRecord; column: Column<IRecord> },
  ) => React.ReactNode;
};

export type SortType = "ASC" | "DESC";

export type DataTableProps<IRecord> = {
  columns: Array<Column<IRecord>>;
  records: Array<IRecord>;
  recordsCount: number;
  getId: (record: IRecord) => string;
  sortState: {
    field: keyof IRecord;
    order: SortType;
  };
  sortStateChange: (sortState: {
    field: keyof IRecord;
    order: SortType;
  }) => void | Promise<void>;
  paginationState: {
    page: number;
    limit: number;
  };
  paginationStateChange: (props: {
    page: number;
    limit: number;
  }) => void | Promise<void>;
};

const defaultRenderer = (value: ValueTypes) => {
  return value as React.ReactNode;
};
export default function DataTable<IRecord>({
  columns,
  records,
  recordsCount,
  sortState,
  paginationState,
  sortStateChange,
  paginationStateChange,
}: DataTableProps<IRecord | RecordType>) {
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={`data-table-column-${column.key}`}>
                <div className="inline-flex">
                  {column.label}
                  {column.sortable && (
                    <button
                      className="inline-flex gap-4"
                      onClick={() =>
                        sortStateChange({
                          field: column.key,
                          order: sortState.order == "ASC" ? "DESC" : "ASC",
                        })
                      }
                    >
                      <Icon icon="arrow-down" height={20} width={20} />
                    </button>
                  )}
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record, i) => (
            <TableRow key={`data-table-row-${i}`}>
              {columns.map((column) => (
                <TableCell key={`data-table-column-${column.key}`}>
                  {(column.renderColumn || defaultRenderer)(
                    record[column.key] as ValueTypes,
                    {
                      record,
                      column,
                    },
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        page={paginationState.page}
        pages={Math.ceil(recordsCount / paginationState.limit)}
        onChange={({ page }) =>
          paginationStateChange({ ...paginationState, page })
        }
      />
    </div>
  );
}
