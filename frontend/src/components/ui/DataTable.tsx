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
import Spinner from "./Spinner";
import Select from "./form/select";

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
  serial?: boolean;
  loading?: boolean;
  checkbox?: boolean;
  getId: (record: IRecord) => string;
  sortState?: {
    field: keyof IRecord;
    order: SortType;
  };
  sortStateChange?: (sortState: {
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
  selectionState?: Array<string>;
  selectionStateChange?: (selection: Array<string>) => void;
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
  serial,
  loading,
  checkbox,
  getId,
  sortState,
  paginationState,
  sortStateChange,
  paginationStateChange,
  selectionState,
  selectionStateChange,
}: DataTableProps<IRecord>) {
  const offset = (paginationState.page - 1) * paginationState.limit;
  return (
    <div className="flex flex-col gap-5">
      <div className="h-full bg-white border rounded-xl overflow-x-auto overflow-hidden relative">
        <Table>
          <TableHead>
            <TableRow header>
              {checkbox && (
                <TableCell className="w-0">
                  <input
                    type="checkbox"
                    className="accent-lime-500 h-4 w-4 cursor-pointer"
                    checked={!!selectionState?.length}
                    onChange={
                      selectionStateChange &&
                      ((e) =>
                        selectionStateChange(
                          e.target.checked ? records.map((e) => getId(e)) : [],
                        ))
                    }
                  />
                </TableCell>
              )}
              {serial && <TableCell className="w-0"></TableCell>}
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
                    {column.sortable && sortState && sortStateChange && (
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
                {checkbox && (
                  <TableCell className="w-0">
                    <input
                      type="checkbox"
                      className="accent-lime-500 h-4 w-4 cursor-pointer"
                      checked={!!selectionState?.includes(getId(record))}
                      onChange={
                        selectionStateChange &&
                        ((e) => {
                          const checked = e.target.checked;
                          let state = [...(selectionState ?? [])];
                          if (checked) {
                            state.push(getId(record));
                          } else {
                            state = state.filter((e) => e != getId(record));
                          }
                          selectionStateChange(state);
                        })
                      }
                    />
                  </TableCell>
                )}
                {serial && (
                  <TableCell className="w-0">{offset + i + 1}</TableCell>
                )}
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

        {!records.length && !loading && (
          <div className="p-5 flex items-center justify-center h-full min-h-60">
            <p>Records are empty!</p>
          </div>
        )}
        {loading && (
          <div className={`${records.length ? "" : "min-h-60"} `}>
            <div className="p-5 flex items-center justify-center absolute h-[calc(100%_-_35px)] w-full left-0 top-[35px] backdrop-blur-sm bg-white/90 transition-all">
              <Spinner />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 flex-nowrap text-nowrap">
        <div className="flex-1">
          Showing : {offset + 1} - {offset + records.length}
        </div>

        <div className="flex gap-2 items-center  flex-nowrap">
          Records per page:
          <Select
            className="h-[35px] border rounded-xl px-2 bg-white w-[60px]"
            value={paginationState.limit}
            onChange={(e) =>
              paginationStateChange({
                page: 1,
                limit: Number(e.target.value),
              })
            }
          >
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </Select>
        </div>

        <Pagination
          page={paginationState.page}
          pages={Math.ceil(recordsCount / paginationState.limit)}
          onChange={({ page }) =>
            paginationStateChange({ ...paginationState, page })
          }
        />
      </div>
    </div>
  );
}
