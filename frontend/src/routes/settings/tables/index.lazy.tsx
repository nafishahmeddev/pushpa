import { ITable } from "@app/types/table";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import TablesApi from "@app/services/tables";
import Table, {
  TableCell,
  TableHead,
  TableRow,
} from "@app/components/ui/table/Table";
import Pagination from "@app/components/ui/Pagination";
import Input from "@app/components/ui/form/input";
import TableFormDialog from "../../../components/form-dialogs/TableFormDialog";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import Button from "@app/components/ui/form/button";

type FormType = {
  filter: {
    name: string;
  };
  query: { page: number; limit: number };
};

export const Route = createLazyFileRoute("/settings/tables/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [result, setResult] = useState<{
    pages: number;
    page: number;
    records: Array<ITable>;
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
      TablesApi.paginate(
        { page: value.query.page, limit: value.query.limit },
        value.filter,
      ).then((res) => {
        setResult(res);
        formApi.setFieldValue("query.page", res.page);
      }),
  });

  const [tableForm, setTableForm] = useState<{
    open: boolean;
    table?: ITable;
  }>({ open: false });

  const handleOnDelete = (table: ITable) => {
    if (confirm("Are you sure?")) {
      TablesApi.delete(table.id).then(form.handleSubmit);
    }
  };

  useEffect(() => {
    form.handleSubmit();
  }, []);

  return (
    <div className=" p-4 flex flex-col gap-5">
      <TableFormDialog
        {...tableForm}
        onReset={() => setTableForm({ open: false, table: undefined })}
        onSave={async () => {
          setTableForm({ open: false, table: undefined });
          form.handleSubmit();
        }}
      />
      <div className="py-4 flex gap-4 items-center h-full">
        <div>
          <h2 className="text-2xl">Tables</h2>
        </div>
        <div className="flex-1" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          onReset={form.reset}
          className="h-9 flex gap-3 "
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

          <Button
            className="bg-lime-500 text-white"
            type="submit"
          >
            Search
          </Button>
          <Button
            className="bg-gray-300"
            type="reset"
          >
            Reset
          </Button>
          <Button
            className="bg-gray-300"
            type="button"
            onClick={() => setTableForm({ open: true, table: undefined })}
          >
            <Icon icon="ic:baseline-add" /> New
          </Button>
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
              <TableCell>Location</TableCell>
              <TableCell className="w-0">Status</TableCell>
              <TableCell className="w-0">Capacity</TableCell>
              <TableCell className="w-0"></TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            {result.records.map((table, index: number) => (
              <TableRow key={`table-${table.id}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{table.name}</TableCell>
                <TableCell>{table.location?.name}</TableCell>
                <TableCell>{table.status}</TableCell>
                <TableCell>{table.capacity}</TableCell>
                <TableCell>
                  <div className="flex flex-nowrap gap-2 text-gray-600">
                    <button
                      onClick={() => setTableForm({ table: table, open: true })}
                      className="hover:opacity-70"
                    >
                      <Icon icon="mynaui:edit" height={20} width={20} />
                    </button>

                    <button
                      onClick={() => handleOnDelete(table)}
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
