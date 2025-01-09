import React from "react";
import { Icon } from "@iconify/react";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "./table/Table";
import Pagination from "./Pagination";
import Formatter from "@app/lib/formatter";

type ValueTypes = never;
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
  sortable?: boolean;
  type?: ColumnType;
  renderColumn?: (
    value: ValueTypes,
    extra: { record: IRecord; column: Column<IRecord> },
  ) => React.ReactNode;
  minWidth?: number;
  width?: number;
  nowrap?: boolean;
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

function defaultRenderer<IRecord>(
  value: ValueTypes,
  { column }: { column: Column<IRecord> },
) {
  if (column.type == "date") {
    return Formatter.date(value);
  }
  if (column.type == "datetime") {
    return Formatter.datetime(value);
  }
  if (column.type == "time") {
    return Formatter.time(value);
  }
  if (column.type == "amount") {
    return Formatter.money(value as number);
  }

  return value;
}
export default function DataTable<IRecord>({
  columns,
  records,
  recordsCount,
  sortState,
  paginationState,
  sortStateChange,
  paginationStateChange,
}: DataTableProps<IRecord>) {
  return (
    <div className="flex flex-col gap-5">
      <div className="h-full bg-white border rounded-xl overflow-x-auto overflow-hidden">
        <Table>
          <TableHead>
            <TableRow header>
              {columns.map((column) => (
                <TableCell
                  key={`data-table-column-${column.key as string}`}
                  style={{
                    minWidth: column.minWidth,
                    width: column.width,
                    whiteSpace: column.nowrap ? "nowrap" : "wrap",
                  }}
                >
                  <div className="inline-flex items-center gap-3">
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
                        <div className="relative text-gray-300 items-center justify-center hover:opacity-70">
                          <span
                            className={`absolute top-0 left-0 ${column.key == sortState.field && sortState.order == "ASC" && "text-gray-950"}`}
                          >
                            <Icon icon="fa6-solid:sort-up" />
                          </span>
                          <span
                            className={`${column.key == sortState.field && sortState.order == "DESC" && "text-gray-950"}`}
                          >
                            <Icon icon="fa6-solid:sort-down" />
                          </span>
                        </div>
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
                  <TableCell
                    key={`data-table-column-${column.key as string}`}
                    style={{
                      minWidth: column.minWidth,
                      width: column.width,
                      whiteSpace: column.nowrap ? "nowrap" : "wrap",
                    }}
                  >
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
      </div>
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
