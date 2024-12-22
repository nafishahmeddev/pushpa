"use client"
import { categories, products } from "@app/db/data";
import React, { useEffect, useState } from "react";

const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

export default function Home() {
  const [prods, setProds] = useState([...products]);
  const [cats, setCats] = useState([...categories]);
  const [keyword, setKeyword] = useState("");

  const filter = () => {
    const _prods = [...products].map(product => {
      product = { ...product };
      const variants = product.variants.filter(variant => {
        variant = { ...variant }
        let full = product.name;
        if (variant.name != "DEFAULT") {
          full = product.name + " " + variant.name;
        }
        return full.toLowerCase().includes(keyword.toLowerCase()) || keyword == "";
      });
      product.variants = variants;
      return product;
    }).filter(product => product.variants.length > 0);
    setProds(_prods);

    const _cat_ids = Array.from(new Set(_prods.map(e => e.category)));
    const _cats = categories.filter(category => _cat_ids.includes(category.id));
    setCats(_cats);
  }

  useEffect(() => {
    console.log(filter());
  }, [keyword]);
  return (
    <div className="flex h-full">
      <div className="flex flex-col h-full max-w-[400px] w-full border-r">
        <div className="p-2 bg-gray-50/10">
          <h1 className=" italic font-bold tracking-wide text-center">
            PUSHPA DHABA
          </h1>
          <input type="text"
            onChange={e => setKeyword(e.target.value)}
            value={keyword}
            className="w-full bg-gray-200/10 py-1 px-2 border-gray-50/50 border rounded-sm mt-2"
            placeholder="Search" />
        </div>

        <div className="flex-1 flex-grow flex overflow-auto w-full">
          <div className="w-full">
            <table className=" w-full">
              <tbody>
                {
                  cats.map(category => (
                    <React.Fragment key={category.name}>
                      <tr className="border-b border-gray-50/50 bg-slate-300/30">
                        <th colSpan={2} className="px-2 py-1">{category.name}</th>
                      </tr>
                      {prods.filter(e => e.category == category.id).map(product => (
                        <React.Fragment key={product.name}>
                          {
                            product.variants.map((variant) => (
                              <tr key={variant.id} className="border-b border-gray-50/50 cursor-pointer hover:bg-gray-100/10">
                                <td className="px-2 py-1 capitalize">{product.name} {variant.name != "DEFAULT" ? variant.name : ""}</td>
                                <td className="px-2 py-1 text-end font-serif">
                                  {
                                    Object.hasOwn(variant, "price") && <>
                                      {typeof variant.price == "number" ? formatter.format(variant.price) : variant.price}
                                    </>
                                  }
                                </td>
                              </tr>
                            ))
                          }
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex-1 h-full">

      </div>
    </div>
  );
}
