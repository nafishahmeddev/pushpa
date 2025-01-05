import ScrollView from "@app/components/ui/ScrollView";
import { IProduct } from "@app/types/product";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import ProductsApi from "@app/services/products";
import Formatter from "@app/lib/formatter";
import ProductFormDialog from "../../../components/form-dialogs/ProductFormDialog";
import Table, {
  TableCell,
  TableHead,
  TableRow,
} from "@app/components/ui/table/Table";
import Pagination from "@app/components/ui/Pagination";
import Input from "@app/components/ui/form/input";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";

type FormType = {
  filter: {
    name: string;
  };
  query: { page: number; limit: number };
};

export const Route = createLazyFileRoute("/settings/products/")({
  component: RouteComponent,
});

function RouteComponent() {
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
    },
    onSubmit: async ({ value, formApi }) =>
      ProductsApi.paginate(
        { page: value.query.page, limit: value.query.limit },
        value.filter,
      ).then((res) => {
        setResult(res);
        formApi.setFieldValue("query.page", res.page);
      }),
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
    <div className="h-full p-4 grid grid-rows-[60px_1fr_35px] gap-5">
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
                className="border rounded-xl px-3"
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
            onClick={() => setProductForm({ open: true, product: undefined })}
          >
            <Icon icon="ic:baseline-add" /> New
          </button>
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
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell className="w-0 text-nowrap">Net Price</TableCell>
              <TableCell className="w-0">Tax</TableCell>
              <TableCell className="w-0">Pice</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            {result.records.map((product, index: number) => (
              <TableRow key={`product-${product.id}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell className="font-mono">
                  {Formatter.money(product.netPrice)}
                </TableCell>
                <TableCell className="font-mono">{product.tax}%</TableCell>
                <TableCell className="font-mono">
                  {Formatter.money(product.price)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-nowrap gap-2 text-gray-600">
                    <button
                      onClick={() =>
                        setProductForm({ product: product, open: true })
                      }
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
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </ScrollView>

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
