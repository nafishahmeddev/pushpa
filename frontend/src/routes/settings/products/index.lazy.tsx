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
import Button from "@app/components/ui/form/button";
import Image from "rc-image";
import { uploadUrl } from "@app/lib/upload";

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
      <div className="h-full bg-white border  overflow-x-auto overflow-hidden">
        <Table bordered>
          <TableHead>
            <TableRow
              className="sticky top-0 left-0 bg-gray-100 z-10 rounded-t-xl"
              header
            >
              <TableCell className="w-0">#</TableCell>
              <TableCell className="w-0">Image</TableCell>
              <TableCell className="min-w-96">Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell className="w-0">Tax</TableCell>
              <TableCell className="w-0">Pice</TableCell>
              <TableCell className="w-0"></TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            {result.records.map((product, index: number) => (
              <TableRow key={`product-${product.id}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="w-0">
                  <Image
                    src={uploadUrl(product.image)}
                    fallback="/placeholder-category.png"
                    className="w-16 h-16 min-h-16 min-w-16 max-w-16 max-h-16 rounded-xl border aspect-square  object-cover bg-gray-100"
                  />
                </TableCell>
                <TableCell>
                  {product.name}
                  <br />
                  <small className="text-gray-600">{product.description}</small>
                </TableCell>
                <TableCell className="text-nowrap">
                  {product.category?.name}
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
