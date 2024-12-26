import React, { useState } from "react";
import { useGetMenuQuery } from "../../store/services/menu";
import _ from "lodash";
import { IProduct } from "../../types/product";
import ScrollView from "../ScrollView";
import { Icon } from "@iconify/react";
import Spinner from "../Spinner";
const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

type MenuListProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  onItemPress?: (item: IProduct) => void;
};
export default function MenuList({ onItemPress, ...props }: MenuListProps) {
  const [keyword, setKeyword] = useState("");
  const { data = {result : []}, error, isLoading } = useGetMenuQuery("test");

  if (error ) {
    return <>Ops! something went wrong...</>;
  }

  const { result: categories = [] } = data;

  const filtered: typeof categories = (
    _.cloneDeep(categories) as typeof categories
  )
    .map((category) => ({
      ...category,
      products: category.products.filter((product) =>
        product.name.toLowerCase().includes(keyword.toLowerCase())
      ),
    }))
    .filter((category) => category.products.length);
  return (
    <div
      {...props}
      className={`grid grid-rows-[60px_1fr] h-full w-full overflow-auto ${props.className}`}
    >
      <div className="p-2 bg-gray-50/10">
        <div className="flex bg-gray-200/10  border rounded-full bg-white mt-2 items-center px-2 ">
          <span className="text-gray-400">
            <Icon icon="tabler:search" height={20} width={20} />
          </span>
          <input
            type="text"
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
            className="w-full  py-1 px-2 flex-1 bg-transparent outline-none"
            placeholder="Search"
          />
        </div>
      </div>
      <ScrollView className="h-full overflow-auto bg-white relative rounded-2xl border-t">
        {isLoading ? (
          <div className="w-full flex items-center justify-center p-5">
            <Spinner />
          </div>
        ) : (
          <table className="w-full">
            <tbody>
              {filtered.map((category) => (
                <React.Fragment key={category.name}>
                  <tr className="sticky top-0">
                    <th colSpan={2} className=" py-2 px-2">
                      <div className="py-1 px-4 bg-gray-50 border flex rounded-full text-center items-center justify-center">
                        {category.name}
                      </div>
                    </th>
                  </tr>
                  {category.products.map((product) => (
                    <tr
                      key={`item-${product.id}`}
                      className="border-b border-gray-50/50 cursor-pointer hover:bg-blue-100 rounded-xl"
                      onClick={() => onItemPress && onItemPress(product)}
                    >
                      <td className="px-2 py-1 capitalize ps-4">
                        {product.name}
                      </td>
                      <td className="px-2 py-1 text-end font-mono pe-4">
                        {formatter.format(product.price)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </ScrollView>
    </div>
  );
}
