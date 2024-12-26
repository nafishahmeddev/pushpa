import ScrollView from "@app/components/ScrollView";
import CategoriesApi from "@app/services/categories";
import { ICategory } from "@app/types/product";
import { useEffect, useState } from "react";
import CategoryForm from "./components/CategoryForm";
import { Icon } from "@iconify/react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const refresh = () => CategoriesApi.all().then(setCategories);

  const [categoryForm, setCategoryForm] = useState<{
    category: ICategory | undefined;
    open: boolean;
  }>({ category: undefined, open: false });

  const handleOnDelete = (category: ICategory) => {
    if (confirm("Are you sure?")) {
      CategoriesApi.delete(category.id).then(refresh);
    }
  };

  useEffect(() => {
    refresh();
  }, []);
  return (
    <div className="h-full bg-white p-4 grid grid-rows-[auto-1fr] gap-5">
      <CategoryForm
        {...categoryForm}
        onReset={() => setCategoryForm({ category: undefined, open: false })}
        onSave={async () => {
          setCategoryForm({ category: undefined, open: false });
          refresh();
        }}
      />

      <div className="py-4 flex gap-4 items-center">
        <h2 className="text-2xl">Categories</h2>
        <button className="border px-2 py-1 rounded-xl bg-gray-50" onClick={()=>setCategoryForm({open: true, category:undefined})}>
          + New Category
        </button>
      </div>

      <ScrollView className="h-full bg-white border rounded-2xl">
        <table className="w-full">
          <thead>
            <tr className="sticky top-0 left-0 bg-gray-100">
              <td className="px-3 py-3 w-0">#</td>
              <td className="px-3 py-3">Name</td>
              <td className="px-3 py-3 w-0"></td>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index: number) => (
              <tr key={`category-${category.id}`}>
                <td className="px-3 py-3 ">{index + 1}</td>

                <td className="text-nowrap px-3 py-3 w-full">
                  {" "}
                  {category.name}
                </td>
                <td className="px-4  w-0">
                  <div className="flex flex-nowrap gap-2 text-gray-600">
                    <button
                      onClick={() =>
                        setCategoryForm({ category: category, open: true })
                      }
                      className="hover:opacity-70"
                    >
                      <Icon icon="mynaui:edit" height={20} width={20} />
                    </button>

                    <button
                      onClick={() => handleOnDelete(category)}
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
