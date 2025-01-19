import { cloneDeep } from "lodash";
import React, { useEffect, useRef } from "react";
import Pagination from "./Pagination";
import { Icon } from "@iconify/react/dist/iconify.js";
import Formatter from "@app/lib/formatter";

//types

type ValueTypes = never;
export type ColumnType =
  | "date"
  | "datetime"
  | "time"
  | "string"
  | "amount"
  | "number";
export type Column<IRecord> = {
  field: keyof IRecord;
  label: string;
  sortable?: boolean;
  type?: ColumnType;
  renderColumn?: (
    value: ValueTypes,
    extra: {
      record: IRecord;
      column: Column<IRecord>;
      index: number;
      serial: number;
    },
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
  loading?: boolean;
  checkboxSelection?: boolean;
  rowSelection?: boolean;
  getId: (record: IRecord) => string;
  sortState?: {
    field: keyof IRecord;
    order: SortType;
  };
  sortStateChange?: (sortState: {
    field: keyof IRecord;
    order: SortType;
  }) => void | Promise<void>;
  paginationState?: {
    page: number;
    limit: number;
  };
  paginationStateChange?: (props: {
    page: number;
    limit: number;
  }) => void | Promise<void>;
  selectionState?: Array<string>;
  selectionStateChange?: (selection: Array<string>) => void;
};

function renderer<IRecord>(
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

function getColumnClass<IRecord>(column: Column<IRecord>) {
  if (column.type == "amount" || column.type == "number") {
    return "text-end";
  }
  return "";
}

const Header: React.FC<{
  children: React.ReactNode;
  ref: React.RefObject<HTMLDivElement | null>;
}> = ({ children, ref }) => {
  return (
    <div
      className="table font-bold bg-black/5 min-w-full table-fixed"
      ref={ref}
    >
      {children}
    </div>
  );
};

const Body: React.FC<{
  children: React.ReactNode;
  ref: React.RefObject<HTMLDivElement | null>;
}> = ({ children, ref }) => {
  return (
    <div className="table min-w-full table-fixed" ref={ref}>
      {children}
    </div>
  );
};

const Row: React.FC<
  {
    children: React.ReactNode;
    rowNo: number;
    selected?: boolean;
  } & React.ComponentProps<"div">
> = ({ children, selected, rowNo, ...props }) => {
  return (
    <div
      {...props}
      className={`table-row border-b ${selected ? "bg-blue-50" : ""}`}
      key={`row-${rowNo}`}
    >
      {children}
    </div>
  );
};

function Column<IRecord>({
  children,
  width,
  sort,
  onShort,
  column,
  header,
}: {
  children: React.ReactNode;
  width?: number;
  sort?: SortType;
  onShort?: (type: SortType) => void | Promise<void>;
  column: Column<IRecord>;
  header?: boolean;
}) {
  return (
    <div
      className="table-cell px-3 py-1.5 border-b focus:outline focus:outline-blue-600/70 outline-2 cursor-pointer"
      tabIndex={-1}
      style={{ width: width + "px" }}
    >
      <div className="flex gap-3">
        <div className={`flex-1 ${getColumnClass(column)}`}>{children}</div>
        {column.sortable && onShort && header && (
          <button
            type="button"
            className="align-middle relative text-sm text-gray-300"
          >
            <span
              className={`absolute left-0 ${sort == "ASC" && "text-gray-900"}`}
            >
              <Icon icon="fa:sort-asc" />
            </span>
            <span className={` ${sort == "DESC" && "text-gray-900"}`}>
              <Icon icon="fa:sort-desc" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

function DataGrid<IRecord>({
  columns,
  records,
  recordsCount,
  getId,

  paginationState,
  paginationStateChange,
  rowSelection,
  checkboxSelection,
  selectionState,
  selectionStateChange,

  sortState,
  sortStateChange,
}: DataTableProps<IRecord>) {
  const offset = paginationState
    ? (paginationState.page - 1) * paginationState.limit
    : 0;
  const bodyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const calculate = () => {
    if (bodyRef.current && headerRef.current) {
      headerRef.current.style.width = bodyRef.current.offsetWidth + "px";
      const hRow = headerRef.current.firstChild;
      const bRow = bodyRef.current.firstChild;

      const bColumns = bRow?.childNodes;
      const hColumns = hRow?.childNodes;

      if (bColumns && hColumns) {
        hColumns.forEach((el, i) => {
          if (
            el instanceof HTMLDivElement &&
            bColumns[i] instanceof HTMLDivElement
          ) {
            el.style.width = bColumns[i].offsetWidth + "px";
          }
        });
      }
    }
  };

  const toggleAll = () => {
    if (selectionState && selectionStateChange) {
      if (selectionState?.length == records.length) {
        selectionStateChange([]);
      } else {
        selectionStateChange(records.map((r) => getId(r)));
      }
    }
  };

  const handleOnRowClick = (
    row: IRecord,
    checked: boolean | undefined = undefined,
  ) => {
    if (selectionStateChange && selectionState) {
      const id = getId(row);
      let _selections = cloneDeep(selectionState);
      if (
        (_selections.find((e) => e == id) && checked == undefined) ||
        checked == false
      ) {
        _selections = _selections.filter((e) => e != id);
      } else {
        _selections.push(id);
      }
      selectionStateChange(_selections);
    }
  };
  useEffect(() => {
    calculate();
    window.addEventListener("resize", calculate);
    return () => {
      window.removeEventListener("resize", calculate);
    };
  }, []);
  return (
    <div className="bg-white rounded-lg overflow-x-auto border">
      <Header ref={headerRef}>
        <Row rowNo={1}>
          {checkboxSelection && (
            <Column column={{ field: "id", label: "" }} header>
              <input
                type="checkbox"
                checked={(selectionState?.length || 0) == records.length}
                onChange={toggleAll}
              />
            </Column>
          )}
          {columns.map((column, i) => (
            <Column
              key={`column-${i}`}
              column={column}
              sort={
                sortState?.field == column.field ? sortState.order : undefined
              }
              onShort={
                sortStateChange
                  ? (s) =>
                      sortStateChange({
                        field: column.field,
                        order: s,
                      })
                  : undefined
              }
              header
            >
              {column.label}
            </Column>
          ))}
        </Row>
      </Header>
      <div>
        <Body ref={bodyRef}>
          {records.map((record, i) => (
            <Row
              key={`row-${i}`}
              rowNo={i + 1}
              onClick={
                rowSelection ? () => handleOnRowClick(record) : undefined
              }
              selected={
                !!selectionState?.find((e) => e == getId(record)) &&
                rowSelection
              }
            >
              {checkboxSelection && (
                <Column column={{ field: "id", label: "" }}>
                  <input
                    type="checkbox"
                    checked={!!selectionState?.find((e) => e == getId(record))}
                    onChange={(e) => handleOnRowClick(record, e.target.checked)}
                  />
                </Column>
              )}
              {columns.map((column, j) => (
                <Column key={`column-${i}${j}`} column={column}>
                  {(column.renderColumn || renderer)(
                    record[column.field] as ValueTypes,
                    {
                      record,
                      column,
                      index: i,
                      serial: offset + i + 1,
                    },
                  )}
                </Column>
              ))}
            </Row>
          ))}
        </Body>
      </div>

      {paginationState && paginationStateChange && (
        <div className="h-full flex justify-center items-center  flex-1  md:flex-none">
          <Pagination
            page={paginationState.page}
            pages={Math.ceil(recordsCount / paginationState.limit)}
            onChange={({ page }) =>
              paginationStateChange({ ...paginationState, page })
            }
          />
        </div>
      )}
    </div>
  );
}

export default DataGrid;
