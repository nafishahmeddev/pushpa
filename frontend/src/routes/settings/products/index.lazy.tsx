import { ICategory, IProduct } from "@app/types/product";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import ProductsApi from "@app/services/products";
import ProductFormDialog from "../../../components/form-dialogs/ProductFormDialog";
import Input from "@app/components/ui/form/input";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import Button from "@app/components/ui/form/button";
import Image from "rc-image";
import { uploadUrl } from "@app/lib/upload";
import DataTable, { Column } from "@app/components/ui/DataTable";

type FormType = {
  filter: {
    name: string;
  };
  query: { page: number; limit: number };
  order: [field: string, sort: SortType];
};

export const Route = createLazyFileRoute("/settings/products/")({
  component: RouteComponent,
});
type SortType = "ASC" | "DESC";

function RouteComponent() {
  const columns = useMemo<Array<Column<IProduct>>>(
    () => [
      {
        key: "image",
        label: "Image",
        width: 0,
        renderColumn: (value) => (
          <Image
            src={uploadUrl(value as string)}
            fallback="/placeholder-category.png"
            className="w-16 h-16 min-h-16 min-w-16 max-w-16 max-h-16 rounded-xl border aspect-square  object-cover bg-gray-100"
          />
        ),
      },
      {
        key: "name",
        label: "Name",
        sortable: true,
        renderColumn: (value, { record }) => (
          <div>
            {value as string}
            <br />
            <small className="text-gray-600">
              {record.description as string}
            </small>
          </div>
        ),
      },

      {
        key: "category",
        label: "Category",
        nowrap: true,
        renderColumn: (category: ICategory) => category?.name as string,
      },

      {
        key: "tax",
        label: "Tax(%)",
        sortable: true,
        width: 0,
        type: "amount",
      },

      {
        key: "price",
        label: "Price",
        sortable: true,
        width: 0,
        type: "amount",
      },
      {
        key: "id",
        label: "",
        width: 0,
        renderColumn: (_, { record: product }) => (
          <div className="flex flex-nowrap gap-2 text-gray-600">
            <button
              onClick={() => setProductForm({ product: product, open: true })}
              className="hover:opacity-70"
            >
              <Icon icon="mynaui:edit" height={20} width={20} />
            </button>

            <button
              onClick={() => handleOnDelete(product)}
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
  const [result, setResult] = useState<{
    pages: number;
    page: number;
    records: Array<IProduct>;
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
      order: ["name", "ASC"],
    },
    onSubmit: async ({ value, formApi }) => {
      return ProductsApi.paginate(
        { page: value.query.page, limit: value.query.limit },
        value.filter,
        value.order,
      ).then((res) => {
        setResult(res);
        formApi.setFieldValue("query.page", res.page);
      });
    },
  });

  const [productForm, setProductForm] = useState<{
    open: boolean;
    product?: IProduct;
  }>({ open: false });

  const handleOnDelete = (product: IProduct) => {
    if (confirm("Are you sure?")) {
      ProductsApi.delete(product.id).then(form.handleSubmit);
    }
  };

  useEffect(() => {
    form.handleSubmit();
  }, []);

  return (
    <div className=" p-4 flex flex-col gap-5">
      <ProductFormDialog
        {...productForm}
        onReset={() => setProductForm({ open: false, product: undefined })}
        onSave={async () => {
          setProductForm({ open: false, product: undefined });
          form.handleSubmit();
        }}
      />
      <div className="py-4 flex gap-4 items-center h-full">
        <div>
          <h2 className="text-2xl">Products</h2>
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
            onClick={() => setProductForm({ open: true, product: undefined })}
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
        recordsCount={result.pages * form.state.values.query.limit}
        sortState={{
          field: form.state.values.order[0] as keyof IProduct,
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
        loading={form.state.isSubmitting}
      />
    </div>
  );
}
