import React, { useState } from "react";
import { ICategory, IProduct } from "../../types/product";
import ScrollView from "../baseui/ScrollView";
import { Icon } from "@iconify/react";
import Spinner from "../baseui/Spinner";
import Formatter from "@app/lib/formatter";
import { useQuery } from "@tanstack/react-query";
import MenuApi from "@app/services/menu";
import { cloneDeep } from "lodash";

type MenuListProps = React.ComponentProps<"div"> & {
  onItemPress?: (item: IProduct) => Promise<void>;
};
export default function MenuList({ onItemPress, ...props }: MenuListProps) {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery<Array<ICategory>>({
    queryKey: ["menu-list"],
    queryFn: MenuApi.menu,
  });

  const [keyword, setKeyword] = useState("");
  const [itemPressLoading, setItemPressLoading] = useState(false);

  const handleOnItemPress = (product: IProduct) => {
    if (!onItemPress) return;
    setItemPressLoading(true);
    onItemPress(product).finally(() => {
      setItemPressLoading(false);
    });
  };

  if (error) {
    return <>Ops! something went wrong...</>;
  }

  const filtered: typeof categories = (
    cloneDeep(categories || []) as Array<ICategory>
  )
    .map((category) => ({
      ...category,
      products: category.products?.filter((product) =>
        product.name.toLowerCase().includes(keyword.toLowerCase()),
      ),
    }))
    .filter((category) => category.products?.length);
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
      <ScrollView className="h-full overflow-auto bg-white relative rounded-xl border-t">
        {isLoading ? (
          <div className="w-full flex items-center justify-center p-5">
            <Spinner />
          </div>
        ) : (
          <div>
            {filtered.map((category) => (
              <div key={category.name}>
                <div className="sticky top-0 py-2 px-2">
                  <div className="py-1 px-4 bg-white/90 text-gray-700 backdrop-blur-sm border flex rounded-xl text-center items-center justify-center font-semibold">
                    {category.name}
                  </div>
                </div>
                {category.products?.map((product) => (
                  <div
                    key={`item-${product.id}`}
                    className={`border-b border-gray-100 cursor-pointer hover:bg-indigo-600/10 flex justify-between rounded-xl mx-2
                      ${itemPressLoading ? "animate-pulse" : ""}`}
                    onClick={() =>
                      !itemPressLoading && handleOnItemPress(product)
                    }
                  >
                    <div className="px-1 py-1 ps-2 flex-1">{product.name}</div>
                    <div className="px-1 py-1 text-end font-mono pe-2 text-indigo-700">
                      {Formatter.money(product.price)}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </ScrollView>
    </div>
  );
}
