import TablesApi from "@app/services/tables";
import { ITable } from "@app/types/table";
import { useEffect, useState } from "react";

// "Occupied" | "Available" | "Reserved" | "Blocked";
const bg = (table: ITable) => {
  if (table.status == "Occupied") {
    return "bg-blue-100";
  }
  return "bg-white";
};

export default function TableViewPage() {
  const [records, setRecords] = useState<Array<ITable>>([]);

  const refresh = () => TablesApi.stats().then(setRecords);
  useEffect(() => {
    refresh();
  }, []);
  return (
    <div className="flex flex-wrap gap-2 p-2">
      {records.map((record) => (
        <div
          key={`table-${record.id}`}
          className={`border p-4 bg-white rounded-xl max-w-32 flex-1 ${bg(
            record
          )}`}
        >
          {record.name}
        </div>
      ))}
    </div>
  );
}
