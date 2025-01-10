import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import UsersFormDialog from "../../components/form-dialogs/UsersFormDialog";
import { IUser } from "@app/types/user";
import UsersApi from "@app/services/users";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import Button from "@app/components/ui/form/button";
import DataTable, { Column } from "@app/components/ui/DataTable";
import { PaginationResponse } from "@app/types/pagination";
import Input from "@app/components/ui/form/input";

export const Route = createLazyFileRoute("/users/")({
  component: RouteComponent,
});

type SortType = "ASC" | "DESC";

type FormType = {
  filter: {
    name: string;
  };
  query: { page: number; limit: number };
  order: [field: keyof IUser, sort: SortType];
};

export default function RouteComponent() {
  const columns = useMemo<Array<Column<IUser>>>(
    () => [
      {
        key: "name",
        label: "Name",
        sortable: true,
      },
      {
        key: "email",
        label: "Email",
        sortable: true,
      },

      {
        key: "phone",
        label: "Phone",
        sortable: true,
      },
      {
        key: "designation",
        label: "Designation",
        sortable: true,
      },
      {
        key: "id",
        label: "",
        width: 0,
        renderColumn: (_, { record: user }) => (
          <div className="flex flex-nowrap gap-2 text-gray-600">
            <button
              onClick={() => setUserForm({ user: user, open: true })}
              className="hover:opacity-70"
            >
              <Icon icon="mynaui:edit" height={20} width={20} />
            </button>

            <button
              onClick={() => handleOnDelete(user)}
              className="hover:opacity-70 text-red-700"
            >
              <Icon icon="proicons:delete" height={20} width={20} />
            </button>
          </div>
        ),
      },
    ],
    [],
  );
  const [result, setResult] = useState<PaginationResponse<IUser>>({
    pages: 1,
    page: 0,
    count: 0,
    records: [],
  });

  const form = useForm<FormType>({
    defaultValues: {
      filter: {
        name: "",
      },
      query: { page: 1, limit: 20 },
      order: ["name", "ASC"],
    },
    onSubmit: async ({ value, formApi }) => {
      return UsersApi.paginate(
        { page: value.query.page, limit: value.query.limit },
        value.filter,
        value.order,
      ).then((res) => {
        setResult(res);
        formApi.setFieldValue("query.page", res.page);
      });
    },
  });

  const [userForm, setUserForm] = useState<{
    open: boolean;
    user?: IUser;
  }>({ open: false });

  const handleOnDelete = (product: IUser) => {
    if (confirm("Are you sure?")) {
      UsersApi.delete(product.id).then(form.handleSubmit);
    }
  };

  useEffect(() => {
    form.handleSubmit();
  }, []);

  return (
    <div className="p-4 py-6 flex flex-col gap-6">
      <UsersFormDialog
        {...userForm}
        onReset={() => setUserForm({ open: false, user: undefined })}
        onSave={async () => {
          setUserForm({ open: false, user: undefined });
          form.handleSubmit();
        }}
      />

      <div className="flex gap-4 items-center h-full">
        <div>
          <h2 className="text-2xl">Users</h2>
        </div>
        <div className="flex-1" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          onReset={form.reset}
          className="h-9 flex gap-3"
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
            onClick={() => setUserForm({ open: true, user: undefined })}
          >
            <Icon icon="ic:baseline-add" /> New
          </Button>
        </form>
      </div>

      <DataTable
        serial
        columns={columns}
        getId={(record) => record.id as string}
        records={result.records}
        recordsCount={result.count}
        loading={form.state.isSubmitting}
        sortState={{
          field: form.state.values.order[0],
          order: form.state.values.order[1],
        }}
        sortStateChange={({ field, order }) => {
          form.setFieldValue("order[0]", field);
          form.setFieldValue("order[1]", order);
          form.setFieldValue("query.page", 1);
          form.handleSubmit();
        }}
        paginationState={{
          page: result.page,
          limit: form.state.values.query.limit,
        }}
        paginationStateChange={({ page, limit }) => {
          form.setFieldValue("query.page", page);
          form.setFieldValue("query.limit", limit);
          form.handleSubmit();
        }}
      />
    </div>
  );
}
