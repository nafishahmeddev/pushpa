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
    open : boolean,
    product?: IProduct,
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
    <div className="h-full grid grid-cols-[1fr]">
      <ProductForm
        {...productForm}
        onReset={() => setProductForm({ open: false, product: undefined })}
        onSave={async () => {
          setProductForm({ open: false, product: undefined});
          refresh();
        }}
      />

      <ScrollView className="h-full bg-white">
        <table className="w-full ">
          <thead>
            <tr className="sticky top-0 left-0 bg-gray-100">
              <td className="px-2 py-2 w-0">#</td>
              <td className="px-2 py-2 w-0"></td>
              <td className="px-2 py-2">Name</td>
              <td className="px-2 py-2">Category</td>
              <td className="px-2 py-2 w-0">CGST%</td>
              <td className="px-2 py-2 w-0">SGST%</td>
              <td className="px-2 py-2 w-0 text-end">Pice</td>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index: number) => (
              <tr key={`product-${product.id}`}>
                <td className="px-2 py-2 text-gray-700">{index + 1}</td>
                <td className="px-4">
                  <div className="flex flex-nowrap gap-2">
                    <button
                      onClick={() => setProductForm({ product: product, open: true })}
                      className="hover:opacity-70 text-white bg-green-700  p-0.5"
                    >
                      <Icon icon="lucide:edit" height={16} width={16} />
                    </button>

                    <button
                      onClick={() => handleOnDelete(product)}
                      className="hover:opacity-70 text-white bg-red-700  p-0.5"
                    >
                      <Icon
                        icon="material-symbols:delete-sharp"
                        height={16}
                        width={16}
                      />
                    </button>
                  </div>
                </td>
                <td className="text-nowrap py-2 px-2"> {product.name}</td>
                <td className="text-nowrap py-2 px-2"> {product.category?.name}</td>
                <td className="text-nowrap py-2 px-2 font-mono text-rose-600">
                  {product.cgst}%
                </td>
                <td className="text-nowrap py-2 px-2 font-mono text-rose-600">
                  {product.sgst}%
                </td>
                <td className="text-nowrap py-2 px-2 text-end font-mono">
                  {Formatter.money(product.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollView>
    </div>
  );
}
