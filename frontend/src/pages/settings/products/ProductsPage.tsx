import ScrollView from "@app/components/ScrollView";
import { IProduct } from "@app/types/product";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import ProductsApi from "@app/services/products";
import Formatter from "@app/lib/formatter";
import ProductForm from "./components/ProductForm";

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
    <div className="h-full bg-white p-4 grid grid-rows-[auto-1fr] gap-5">
      <ProductForm
        {...productForm}
        onReset={() => setProductForm({ open: false, product: undefined })}
        onSave={async () => {
          setProductForm({ open: false, product: undefined });
          refresh();
        }}
      />

      <div className="py-4 flex gap-4 items-center">
        <h2 className="text-2xl">Products</h2>
        <button
          className="border px-2 py-1 rounded-xl bg-gray-50"
          onClick={() => setProductForm({ open: true, product: undefined })}
        >
          + New
        </button>
      </div>

      <ScrollView className="h-full bg-white border rounded-2xl">
        <table className="w-full">
          <thead>
            <tr className="sticky top-0 left-0 bg-gray-100 z-10">
              <td className="px-3 py-3  w-0">#</td>
              <td className="px-3 py-3 ">Name</td>
              <td className="px-3 py-3">Category</td>
              <td className="px-3 py-3 w-0">CGST%</td>
              <td className="px-3 py-3 w-0">SGST%</td>
              <td className="px-3 py-3 w-0 text-end">Pice</td>
              <td className="px-3 py-3 w-0"></td>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index: number) => (
              <tr key={`product-${product.id}`}>
                <td className="px-3 py-3">{index + 1}</td>

                <td className="text-nowrap px-3 py-3 w-full">{product.name}</td>
                <td className="text-nowrap px-3 py-3">
                  {product.category?.name}
                </td>
                <td className="px-4  w-0">{product.cgst}%</td>
                <td className="px-4  w-0">{product.sgst}%</td>
                <td className="px-4  w-0">{Formatter.money(product.price)}</td>
                <td className="px-4  w-0 sticky right-0 bg-white">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollView>
    </div>
  );
}
