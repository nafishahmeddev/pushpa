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
  }>({ category: undefined });

  const handleOnDelete = (category: ICategory) => {
    if (confirm("Are you sure?")) {
      CategoriesApi.delete(category.id).then(refresh);
    }
  };

  useEffect(() => {
    refresh();
  }, []);
  return (
    <div className="h-full grid grid-cols-[auto_1fr]">
      <CategoryForm
        {...categoryForm}
        onReset={() => setCategoryForm({ category: undefined })}
        onSave={async () => {
          setCategoryForm({ category: undefined });
          refresh();
        }}
      />

      <ScrollView className="h-full bg-white">
        <table className="w-full">
          <thead>
            <tr className="sticky top-0 left-0 bg-gray-100">
              <td className="px-2 py-2 w-0">#</td>
              <td className="px-2 py-2 w-0"></td>
              <td className="px-2 py-2">Name</td>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index: number) => (
              <tr key={`category-${category.id}`}>
                <td className="px-2 py-2 text-gray-700">{index + 1}</td>
                <td className="px-4">
                  <div className="flex flex-nowrap gap-2">
                    <button
                      onClick={() => setCategoryForm({ category: category })}
                      className="hover:opacity-70 text-white bg-green-700  p-0.5"
                    >
                      <Icon icon="lucide:edit" height={16} width={16} />
                    </button>

                    <button
                      onClick={() => handleOnDelete(category)}
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
                <td className="text-nowrap py-2"> {category.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollView>
    </div>
  );
}
