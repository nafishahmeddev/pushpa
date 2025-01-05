import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Table, {
  TableCell,
  TableHead,
  TableRow,
} from "@app/components/ui/table/Table";
import Pagination from "@app/components/ui/Pagination";
import Input from "@app/components/ui/form/input";
import { ILocation } from "@app/types/location";
import LocationsApi from "@app/services/locations";
import LocationFormDialog from "../../../components/form-dialogs/LocationFormDialog";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import Button from "@app/components/ui/form/button";

type FormType = {
  filter: {
    name: string;
  };
  query: { page: number; limit: number };
};

export const Route = createLazyFileRoute("/settings/locations/")({
  component: RouteComponent,
});

export default function RouteComponent() {
  const [result, setResult] = useState<{
    pages: number;
    page: number;
    records: Array<ILocation>;
  }>({
    pages: 1,
    page: 0,
    records: [],
  });
  const form = useForm<FormType>({
    defaultValues: {
      filter: {
        name: "",
      },
      query: { page: 1, limit: 20 },
    },
    onSubmit: async ({ value, formApi }) =>
      LocationsApi.paginate(
        { page: value.query.page, limit: value.query.limit },
        value.filter,
      ).then((res) => {
        setResult(res);
        formApi.setFieldValue("query.page", res.page);
      }),
  });

  const [locationForm, setLocationForm] = useState<{
    open: boolean;
    location?: ILocation;
  }>({ open: false });

  const handleOnDelete = (location: ILocation) => {
    if (confirm("Are you sure?")) {
      LocationsApi.delete(location.id).then(form.handleSubmit);
    }
  };

  useEffect(() => {
    form.handleSubmit();
  }, []);

  return (
    <div className=" p-4 flex flex-col gap-5">
      <LocationFormDialog
        {...locationForm}
        onReset={() => setLocationForm({ open: false, location: undefined })}
        onSave={async () => {
          setLocationForm({ open: false, location: undefined });
          form.handleSubmit();
        }}
      />
      <div className="py-4 flex gap-4 items-center h-full">
        <div>
          <h2 className="text-2xl">Locations</h2>
        </div>
        <div className="flex-1" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          onReset={form.reset}
          className="h-9"
        >
          <fieldset
            className="flex gap-3 h-full"
            disabled={form.state.isSubmitting}
            onBlur={() => form.setFieldValue("query.page", 1)}
          >
            <form.Field
              name="filter.name"
              children={({ state, handleBlur, handleChange, name }) => (
                <Input
                  placeholder="Name"
                  type="text"
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  name={name}
                  error={state.meta.errors.join(" ")}
                  touched={state.meta.isTouched}
                />
              )}
            />

            <Button className="bg-lime-500 text-white" type="submit">
              Search
            </Button>
            <Button className="bg-gray-300" type="reset">
              Reset
            </Button>
            <Button
              className="bg-gray-300"
              type="button"
              onClick={() =>
                setLocationForm({ open: true, location: undefined })
              }
            >
              <Icon icon="ic:baseline-add" /> New
            </Button>
          </fieldset>
        </form>
      </div>
      <div className="bg-white border rounded-xl overflow-hidden">
        <Table bordered>
          <TableHead>
            <TableRow
              className="sticky top-0 left-0 bg-gray-100 z-10 rounded-t-xl"
              header
            >
              <TableCell className="w-0">#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell className="w-0"></TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            {result.records.map((location, index: number) => (
              <TableRow key={`location-${location.id}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{location.name}</TableCell>
                <TableCell>
                  <div className="flex flex-nowrap gap-2 text-gray-600">
                    <button
                      onClick={() =>
                        setLocationForm({ location: location, open: true })
                      }
                      className="hover:opacity-70"
                    >
                      <Icon icon="mynaui:edit" height={20} width={20} />
                    </button>

                    <button
                      onClick={() => handleOnDelete(location)}
                      className="hover:opacity-70 text-red-700"
                    >
                      <Icon icon="proicons:delete" height={20} width={20} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>
      <form.Subscribe
        children={({ values }) => (
          <Pagination
            page={values.query.page}
            pages={result.pages}
            onChange={(e) => {
              form.setFieldValue("query.page", e.page);
              form.handleSubmit();
            }}
          />
        )}
      />
    </div>
  );
}
