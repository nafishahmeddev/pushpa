import CategoriesApi from "@app/services/categories";
import { ICategory } from "@app/types/product";
import { useEffect, useState } from "react";
import CategoryFormDialog from "../../../components/form-dialogs/CategoryFormDialog";
import { Icon } from "@iconify/react";
import { createLazyFileRoute } from "@tanstack/react-router";
import Button from "@app/components/baseui/Button";
import PopMenu, {
  PopMenuContent,
  PopMenuItem,
  PopMenuTrigger,
} from "@app/components/baseui/PopMenu";
export const Route = createLazyFileRoute("/settings/categories/")({
  component: RouteComponent,
});
function RouteComponent() {
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
    <div className=" p-4 flex flex-col gap-5">
      <CategoryFormDialog
        {...categoryForm}
        onReset={() => setCategoryForm({ category: undefined, open: false })}
        onSave={async () => {
          setCategoryForm({ category: undefined, open: false });
          refresh();
        }}
      />

      <div className="py-4 flex flex-col gap-1">
        <h2 className="text-2xl">Categories</h2>
        <p className="text-gray-500">Here you can manage all the categories.</p>
      </div>
      <div className="gap-4 grid  grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
        {categories.map((category, index: number) => (
          <div
            key={`category-${category.id}-${index}`}
            className="flex bg-white border p-3 rounded-2xl gap-3 items-center"
          >
            <p className="flex-1">{category.name}</p>
            <div className="flex flex-nowrap gap-2 text-gray-600 ">
              <PopMenu>
                <PopMenuTrigger>
                  <button className="hover:opacity-70 border p-1 rounded-full">
                    <Icon icon="mingcute:more-2-line" height={20} width={20} />
                  </button>
                </PopMenuTrigger>
                <PopMenuContent>
                  <PopMenuItem
                    onClick={() =>
                      setCategoryForm({ category: category, open: true })
                    }
                  >
                    <Icon icon="mynaui:edit" height={20} width={20} />
                    <span>Edit Category</span>
                  </PopMenuItem>

                  <PopMenuItem
                    onClick={() => handleOnDelete(category)}
                    className="text-red-600"
                  >
                    <Icon icon="proicons:delete" height={20} width={20} />
                    <span>Delete Category</span>
                  </PopMenuItem>
                </PopMenuContent>
              </PopMenu>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Button
          className="bg-lime-600 text-white"
          onClick={() => setCategoryForm({ open: true, category: undefined })}
        >
          + Create Category
        </Button>
      </div>
    </div>
  );
}
