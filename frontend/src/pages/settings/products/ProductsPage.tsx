import ScrollView from "@app/components/ui/ScrollView";
import { IProduct } from "@app/types/product";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import ProductsApi from "@app/services/products";
import Formatter from "@app/lib/formatter";
import ProductForm from "./components/ProductForm";
import Table, {
  TableCell,
  TableHead,
  TableRow,
} from "@app/components/ui/table/Table";
import { useFormik } from "formik";
import Pagination from "@app/components/ui/Pagination";
import Input from "@app/components/ui/form/input";

export default function ProductsPage() {
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: paginate,
  });
  const [query, setQuery] = useState({ page: 1, limit: 20 });
  const [result, setResult] = useState<{
    pages: number;
    page: number;
    records: Array<IProduct>;
  }>({
    pages: 1,
    page: 0,
    records: [],
  });

  function paginate(values: { [key: string]: unknown }) {
    return ProductsApi.paginate(
      { page: query.page, limit: query.limit },
      values
    ).then((res) => {
      setResult(res);
      setQuery({ page: res.page, limit: query.limit });
    });
  }
  const [productForm, setProductForm] = useState<{
    open: boolean;
    product?: IProduct;
  }>({ open: false });

  const handleOnDelete = (product: IProduct) => {
    if (confirm("Are you sure?")) {
      ProductsApi.delete(product.id).then(formik.submitForm);
    }
  };

  useEffect(() => {
    if (query.page != result.page) {
      formik.submitForm();
    }
  }, [query]);
  return (
    <div className="h-full p-4 grid grid-rows-[60px_1fr_35px] gap-5">
      <ProductForm
        {...productForm}
        onReset={() => setProductForm({ open: false, product: undefined })}
        onSave={async () => {
          setProductForm({ open: false, product: undefined });
          formik.submitForm();
        }}
      />

      <div className="py-4 flex gap-4 items-center h-full">
        <div>
          <h2 className="text-2xl">Products</h2>
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
          >
            <Input
              className="border rounded-xl px-3"
              placeholder="Name"
              type="text"
              {...formik.getFieldProps("name")}
            />

            <button className="rounded-xl px-3 bg-blue-500 text-white hover:opacity-50">
              Search
            </button>
            <button
              className="rounded-xl px-3 bg-gray-300 hover:opacity-50"
              type="reset"
            >
              Reset
            </button>
            <button
              className="rounded-xl px-3 bg-gray-300 hover:opacity-50"
              onClick={() => setProductForm({ open: true, product: undefined })}
            >
              + New
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
              <TableCell>Category</TableCell>
              <TableCell className="w-0">CGST%</TableCell>
              <TableCell className="w-0">SGST%</TableCell>
              <TableCell className="w-0">Pice</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            {result.records.map((product, index: number) => (
              <TableRow key={`product-${product.id}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>{product.cgst}%</TableCell>
                <TableCell>{product.sgst}%</TableCell>
                <TableCell>{Formatter.money(product.price)}</TableCell>
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
      <Pagination
        page={query.page}
        pages={result.pages}
        onChange={(e) => setQuery({ ...query, ...e })}
      />
    </div>
  );
}
