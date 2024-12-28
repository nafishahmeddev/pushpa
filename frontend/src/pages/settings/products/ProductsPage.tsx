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

export default function ProductsPage() {
  const [products, setCategories] = useState<Array<IProduct>>([]);
  const refresh = () => ProductsApi.all().then(setCategories);

  const [productForm, setProductForm] = useState<{
    open: boolean;
    product?: IProduct;
  }>({ open: false });

  const handleOnDelete = (product: IProduct) => {
    if (confirm("Are you sure?")) {
      ProductsApi.delete(product.id).then(refresh);
    }
  };

  useEffect(() => {
    refresh();
  }, []);
  return (
    <div className="h-full p-4 grid grid-rows-[60px_1fr] gap-5">
      <ProductForm
        {...productForm}
        onReset={() => setProductForm({ open: false, product: undefined })}
        onSave={async () => {
          setProductForm({ open: false, product: undefined });
          refresh();
        }}
      />

      <div className="py-4 flex gap-4 items-center h-full">
        <h2 className="text-2xl">Products</h2>
        <button
          className="border px-2 py-1 rounded-xl bg-gray-50"
          onClick={() => setProductForm({ open: true, product: undefined })}
        >
          + New
        </button>
      </div>

      <ScrollView className="h-full bg-white border rounded-xl overflow-hidden">
        <Table bordered>
          <TableHead>
            <TableRow
              className="sticky top-0 left-0 bg-gray-100 z-10 rounded-t-xl"
              header
            >
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>CGST%</TableCell>
              <TableCell>SGST%</TableCell>
              <TableCell>Pice</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            {products.map((product, index: number) => (
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
    </div>
  );
}
