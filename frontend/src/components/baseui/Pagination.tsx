import { Icon } from "@iconify/react";
import React from "react";
type PaginationProps = {
  page: number;
  pages: number;
  onChange?: (props: { page: number }) => Promise<void> | void;
};

const createPaginationButtonsRange = (page: number, pages: number) => {
  const range: (number | string)[] = [];
  const pageNumberLimit = 6;

  // If pages are less than or equal to 6, display all pages
  if (pages <= pageNumberLimit) {
    for (let i = 1; i <= pages; i++) {
      range.push(i);
    }
    return range;
  }

  // Always show first page, last page, and current page with adjacent pages
  if (page <= 3) {
    range.push(1, 2, 3, 4, "...", pages);
  } else if (page >= pages - 2) {
    range.push(1, "...", pages - 3, pages - 2, pages - 1, pages);
  } else {
    range.push(1, "...", page - 1, page, page + 1, "...", pages);
  }

  return range;
};

export default function Pagination({ page, pages, onChange }: PaginationProps) {
  if (pages == 0) return <></>;
  const range = createPaginationButtonsRange(page, pages);
  return (
    <div className="flex items-center gap-2 h-[35px]">
      <button
        className={`border rounded-lg bg-white  h-full ps-1.5 pe-3 flex items-center justify-center disabled:text-gray-400 gap-2`}
        onClick={() => onChange && onChange({ page: page - 1 })}
        disabled={page <= 1}
      >
        <Icon icon="ph:caret-left-bold" />
        <span>Prev</span>
      </button>

      <div className="flex items-center h-full gap-0.5">
        {range.map((seq) => (
          <React.Fragment key={seq}>
            {seq === "..." ? (
              <span className="text-3xl text-center flex px-1">
                <Icon icon="mynaui:dots" />
              </span>
            ) : (
              <button
                key={`pagination-${seq}`}
                className={` px-2 aspect-square  h-full  flex items-center justify-center rounded-lg border 
                      ${seq == page ? "bg-indigo-600/10 text-indigo-800 " : "bg-white"}`}
                onClick={() =>
                  page != seq && onChange && onChange({ page: seq as number })
                }
                disabled={seq == page}
              >
                {seq}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
      <button
        className={`border rounded-lg bg-white  h-full  pe-1.5 ps-3  flex items-center justify-center disabled:text-gray-400 gap-2`}
        onClick={() => onChange && onChange({ page: page + 1 })}
        disabled={page >= pages}
      >
        <span>Next</span>
        <Icon icon="ph:caret-right-bold" />
      </button>
    </div>
  );
}
