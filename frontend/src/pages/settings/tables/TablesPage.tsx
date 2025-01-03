import ScrollView from "@app/components/ui/ScrollView";
import { ITable } from "@app/types/table";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import TablesApi from "@app/services/tables";
import Table, {
  TableCell,
  TableHead,
  TableRow,
} from "@app/components/ui/table/Table";
import { useFormik } from "formik";
import Pagination from "@app/components/ui/Pagination";
import Input from "@app/components/ui/form/input";
import TableForm from "./components/TableForm";

type FormType = {
  filter: {
    name: string;
  };
  query: { page: number; limit: number };
};

export default function TablesPage() {
  const [result, setResult] = useState<{
    pages: number;
    page: number;
    records: Array<ITable>;
  }>({
    pages: 1,
    page: 0,
    records: [],
  });
  const formik = useFormik<FormType>({
    initialValues: {
      filter: {
        name: "",
      },
      query: { page: 1, limit: 20 },
    },
    onSubmit: async (values, helper) =>
      TablesApi.paginate(
        { page: values.query.page, limit: values.query.limit },
        values.filter
      ).then((res) => {
        setResult(res);
        helper.setFieldValue("query.page", res.page);
      }),
  });

  const [tableForm, setTableForm] = useState<{
    open: boolean;
    table?: ITable;
  }>({ open: false });

  const handleOnDelete = (table: ITable) => {
    if (confirm("Are you sure?")) {
      TablesApi.delete(table.id).then(formik.submitForm);
    }
  };

  useEffect(() => {
    formik.submitForm();
  }, []);

  return (
    <div className="h-full p-4 grid grid-rows-[60px_1fr_35px] gap-5">
      <TableForm
        {...tableForm}
        onReset={() => setTableForm({ open: false, table: undefined })}
        onSave={async () => {
          setTableForm({ open: false, table: undefined });
          formik.submitForm();
        }}
      />
      <div className="py-4 flex gap-4 items-center h-full">
        <div>
          <h2 className="text-2xl">Tables</h2>
        </div>
        <div className="flex-1" />
        <form
          onSubmit={formik.handleSubmit}
          onReset={formik.handleReset}
          className="h-9"
        >
          <fieldset
            className="flex gap-3 h-full"
            disabled={formik.isSubmitting}
            onBlur={() => formik.setFieldValue("query.page", 1)}
          >
            <Input
              className="border rounded-xl px-3"
              placeholder="Name"
              type="text"
              {...formik.getFieldProps("filter.name")}
            />

            <button
              className="rounded-xl px-3 bg-lime-500 text-white hover:opacity-50"
              type="submit"
            >
              Search
            </button>
            <button
              className="rounded-xl px-3 bg-gray-300 hover:opacity-50"
              type="reset"
            >
              Reset
            </button>
            <button
              className="rounded-xl px-3 bg-gray-300 hover:opacity-50 flex items-center justify-center gap-0.5"
              type="button"
              onClick={() => setTableForm({ open: true, table: undefined })}
            >
              <Icon icon="ic:baseline-add" /> New
            </button>
          </fieldset>
        </form>
      </div>
      <ScrollView className="h-full bg-white border rounded-xl overflow-hidden">
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
      </ScrollView>
      <Pagination
        page={formik.values.query.page}
        pages={result.pages}
        onChange={(e) => {
          formik.setFieldValue("query.page", e.page).then(formik.submitForm);
        }}
      />
    </div>
  );
}
