import React, { createContext, useContext } from "react";
const TableContext = createContext<{
  size: "md" | "lg" | "sm";
  bordered: boolean;
}>({
  size: "md",
  bordered: true,
});

const TableRowContext = createContext<{ header?: boolean }>({ header: false });
export function TableHead(props: React.ComponentProps<"thead">) {
  return <thead {...props}></thead>;
}

export function TableBody(props: React.ComponentProps<"tbody">) {
  return <tbody {...props}></tbody>;
}

export function TableRow({
  header,
  ...props
}: React.ComponentProps<"tr"> & { header?: boolean }) {
  const tableTheme = useContext(TableContext);
  const classNames = [props.className];
  if (tableTheme.bordered) {
    classNames.push("border-b");
  }
  if (header) {
    classNames.push("bg-gray-100");
  }
  return (
    <TableRowContext.Provider value={{ header: header }}>
      <tr {...props} className={classNames.join(" ")}></tr>
    </TableRowContext.Provider>
  );
}

export function TableCell({ ...props }: React.ComponentProps<"td" | "th">) {
  const tableTheme = useContext(TableContext);
  const tableRowTheme = useContext(TableRowContext);
  const classNames = ["text-start"];
  switch (tableTheme.size) {
    case "md": {
      classNames.push("px-3 py-2");
      break;
    }
    case "lg": {
      classNames.push("px-4 py-3");
      break;
    }
    case "sm": {
      classNames.push("px-2 py-1.5 text-sm");
      break;
    }
  }

  return (
    <React.Fragment>
      {tableRowTheme.header ? (
        <th
          {...props}
          className={[...classNames, props.className, "font-medium", "text-gray-600"].join(
            " ",
          )}
        />
      ) : (
        <td {...props} className={[...classNames, props.className].join(" ")} />
      )}
    </React.Fragment>
  );
}

export default function Table({
  size = "md",
  bordered = false,
  ...props
}: React.ComponentProps<"table"> & {
  size?: "md" | "lg" | "sm";
  bordered?: boolean;
}) {
  return (
    <TableContext.Provider value={{ size, bordered }}>
      <table {...props} className={["min-w-full", props.className].join(" ")} />
    </TableContext.Provider>
  );
}
