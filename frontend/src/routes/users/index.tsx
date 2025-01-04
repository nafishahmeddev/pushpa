import ScrollView from "@app/components/ui/ScrollView";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import UsersFormDialog from "../../components/form-dialogs/UsersFormDialog";
import { IUser } from "@app/types/user";
import UsersApi from "@app/services/users";
import { useFormik } from "formik";
import Table, { TableBody, TableCell, TableHead, TableRow } from "@app/components/ui/table/Table";
import Formatter from "@app/lib/formatter";
import Pagination from "@app/components/ui/Pagination";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users/")({
  component: RouteComponent,
});

export default function RouteComponent() {
  const form = useFormik({
    initialValues: {
      createdAt: ["", ""],
    },
    onSubmit: paginate,
  });
  const [query, setQuery] = useState({ page: 1, limit: 20 });
  const [result, setResult] = useState<{
    pages: number;
    page: number;
    records: Array<IUser>;
  }>({
    pages: 1,
    page: 0,
    records: [],
  });

  const [userForm, setUserForm] = useState<{
    open: boolean;
    user?: IUser;
  }>({ open: false });

  function paginate(values: { [key: string]: unknown }) {
    return UsersApi.paginate({ page: query.page, limit: query.limit }, values).then((res) => {
      setResult(res);
      setQuery({ page: res.page, limit: query.limit });
    });
  }

  const handleOnDelete = (product: IUser) => {
    if (confirm("Are you sure?")) {
      UsersApi.delete(product.id).then(form.submitForm);
    }
  };

  useEffect(() => {
    if (query.page != result.page) {
      form.submitForm();
    }
  }, [query]);
  return (
    <div className="h-full  p-4 grid grid-rows-[60px_1fr_35px] gap-5">
      <UsersFormDialog
        {...userForm}
        onReset={() => setUserForm({ open: false, user: undefined })}
        onSave={async () => {
          setUserForm({ open: false, user: undefined });
          form.submitForm();
        }}
      />

      <div className="py-4 flex gap-4 items-center h-full">
        <h2 className="text-2xl">Users</h2>
        <button className="border px-2 py-1 rounded-xl bg-gray-50" onClick={() => setUserForm({ open: true, user: undefined })}>
          + New
        </button>
      </div>

      <ScrollView className="h-full bg-white border rounded-xl overflow-hidden">
        <Table bordered>
          <TableHead>
            <TableRow className="sticky top-0 left-0 bg-gray-100 z-10 rounded-t-xl" header>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {result.records.map((user, index: number) => (
              <TableRow key={`product-${user.id}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{Formatter.phone(user.phone)}</TableCell>
                <TableCell>{user.designation}</TableCell>

                <TableCell className="w-0 sticky right-0 bg-white">
                  <div className="flex flex-nowrap gap-2 text-gray-600">
                    <button onClick={() => setUserForm({ user: user, open: true })} className="hover:opacity-70">
                      <Icon icon="mynaui:edit" height={20} width={20} />
                    </button>

                    <button onClick={() => handleOnDelete(user)} className="hover:opacity-70 text-red-700">
                      <Icon icon="proicons:delete" height={20} width={20} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollView>
      <Pagination page={query.page} pages={result.pages} onChange={(e) => setQuery({ ...query, ...e })} />
    </div>
  );
}
