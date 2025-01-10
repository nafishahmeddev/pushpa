import { Icon } from "@iconify/react";
type PaginationProps = {
  page: number;
  pages: number;
  onChange?: (props: { page: number }) => Promise<void> | void;
};

export default function Pagination({ page, pages, onChange }: PaginationProps) {
  if (pages == 0) return <></>;
  return (
    <div className="flex items-center gap-2 h-[35px]">
      <button
        className={`border rounded-xl bg-white  h-full ps-1.5 pe-3 flex items-center justify-center disabled:text-gray-400 gap-2`}
        onClick={() => onChange && onChange({ page: page - 1 })}
        disabled={page <= 1}
      >
        <Icon icon="ph:caret-left-bold" />
        <span>Prev</span>
      </button>

      <div className="flex items-center gap-0 h-full">
        {Array.from({ length: pages })
          .map((_, i) => i + 1)
          .map((seq) => (
            <button
              key={`pagination-${seq}`}
              className={` px-2 aspect-square  h-full  flex items-center justify-center rounded-xl border 
                      ${seq == page ? "bg-lime-600/10 text-lime-800 " : "bg-transparent border-transparent"}`}
              onClick={() => page != seq && onChange && onChange({ page: seq })}
              disabled={seq == page}
            >
              {seq}
            </button>
          ))}
      </div>
      <button
        className={`border rounded-xl bg-white  h-full  pe-1.5 ps-3  flex items-center justify-center disabled:text-gray-400 gap-2`}
        onClick={() => onChange && onChange({ page: page + 1 })}
        disabled={page >= pages}
      >
        <span>Next</span>
        <Icon icon="ph:caret-right-bold" />
      </button>
    </div>
  );
}
