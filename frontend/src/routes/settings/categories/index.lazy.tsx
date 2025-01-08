import CategoriesApi from "@app/services/categories";
import { ICategory } from "@app/types/product";
import { useEffect, useState } from "react";
import CategoryFormDialog from "../../../components/form-dialogs/CategoryFormDialog";
import { Icon } from "@iconify/react";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@app/components/ui/table/Table";
import { createLazyFileRoute } from "@tanstack/react-router";
import Button from "@app/components/ui/form/button";
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

      <div className="py-4 flex gap-4 items-center">
        <h2 className="text-2xl">Categories</h2>
        <Button
          className="bg-gray-200"
          onClick={() => setCategoryForm({ open: true, category: undefined })}
        >
          + New
        </Button>
      </div>
      <div className="bg-white border rounded-xl  overflow-x-auto overflow-hidden">
        <Table bordered>
          <TableHead>
            <TableRow className="sticky top-0 left-0 bg-gray-100">
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, index: number) => (
              <TableRow key={`category-${category.id}`}>
                <TableCell className="w-0">{index + 1}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell className="w-0">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
