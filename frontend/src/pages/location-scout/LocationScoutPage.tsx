import LocationsApi from "@app/services/locations";
import { ILocation } from "@app/types/location";
import { ITable } from "@app/types/table";
import { useEffect, useState } from "react";

// "Occupied" | "Available" | "Reserved" | "Blocked";
const bg = (table: ITable) => {
  if (table.status == "Occupied") {
    return "bg-yellow-50";
  }
  return "bg-green-50";
};

export default function LocationScoutPage() {
  const [locations, setLocations] = useState<Array<ILocation>>([]);

  const refresh = () => LocationsApi.scout().then(setLocations);
  useEffect(() => {
    refresh();
  }, []);
  return (
    <div className="p-2">
      {locations.map((location) => (
        <div key={`table-${location.id}`} className="flex flex-col gap-2">
          {location.name}
          <div key={`table-${location.id}`} className="flex flex-wrap gap-2 ">
            {(location.tables ?? []).map((table) => (
              <div
                className={[
                  `border p-4 rounded-xl max-w-40 flex-1`,
                  bg(table),
                ].join(" ")}
              >
                {table.name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
