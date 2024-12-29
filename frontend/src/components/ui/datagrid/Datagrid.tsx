import React from "react";
import { Icon } from "@iconify/react";
import Formatter from "@app/lib/formatter";
type DataGridColumValue = string | number | Date | boolean;
type DatagridColumnType =
  | "date"
  | "datetime"
  | "time"
  | "number"
  | "string"
  | "phone"
  | "amount";
export type DatagridColumn = {
  key: string;
  name: string;
  cellProps?: React.ComponentProps<"div">;
  type?: DatagridColumnType;
  renderCell?: (
    value: DataGridColumValue,
    column?: DatagridColumn,
    row?: { index: number; record: Record<DatagridProps["columns"][number]["key"], DataGridColumValue> }
  ) => React.ReactNode;
};

export type DatagridProps = {
  columns: Array<DatagridColumn>;
  items: Array<
    Record<DatagridProps["columns"][number]["key"], DataGridColumValue>
  >;
  onChangeSelection?: (ids: Array<DataGridColumValue>) => void | Promise<void>;
  getId: (
    record: Record<DatagridProps["columns"][number]["key"], DataGridColumValue>
  ) => DataGridColumValue;
};

const parseColumnValue = (
  value: string | Date | number | boolean,
  column: DatagridColumn
): string => {
  switch (column.type) {
    case "date":
      return Formatter.date(value as string | Date);
    case "datetime":
      return Formatter.datetime(value as string | Date);
    case "time":
      return Formatter.time(value as string | Date);
    case "phone":
      return Formatter.phone(value as string);
    case "amount":
      return Formatter.money(value as number);
    default:
      return value as string;
  }
};

export default function Datagrid({
  columns,
  items,
}: DatagridProps) {
  const sort = "price";
  return (
    <div className=" h-full overflow-hidden border bg-white rounded-xl">
      <div className="grid overflow-auto relative h-full" role="grid text-sm">
        {columns.map((column, index) => (
          <div
            key={column.key}
            style={{ gridRow: 1, gridColumn: index + 1 }}
            className={[
              "px-2 py-2 sticky top-0 bg-slate-50 text-nowrap flex items-center gap-1 justify-between z-10 border-b font-bold",
              column.cellProps?.className,
            ].join(" ")}
          >
            {column.name}
            {sort == column.key && (
              <button className=" text-gray-700 hover:opacity-50">
                <Icon icon="prime:sort-down-fill" height={20} width={20} />
              </button>
            )}
          </div>
        ))}

        {items.map((item, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {columns.map((column, columnIndex) => (
              <div
                key={column.key}
                style={{ gridRow: rowIndex + 2, gridColumn: columnIndex + 1 }}
                className={[
                  "px-2 py-2 min-w-min w-full border-b text-nowrap",
                  column.cellProps?.className,
                ].join(" ")}
                onClick={() => console.log("ops")}
                role="cell"
              >
                {column.renderCell
                  ? column.renderCell(item[column.key], column, {
                      index: rowIndex,
                      record: item,
                    })
                  : parseColumnValue(item[column.key], column)}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
