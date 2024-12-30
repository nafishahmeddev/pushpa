import { Icon } from "@iconify/react";
type PaginationProps = {
  page: number;
  pages: number;
  onChange?: (props: { page: number }) => Promise<void> | void;
};
export default function Pagination({ page, pages, onChange }: PaginationProps) {
  if(pages == 0) return <></>;
  return (
    <div className="flex items-center gap-2 h-[35px]">
      <button
        className={`border rounded-xl bg-white px-3 aspect-square h-full  flex items-center justify-center disabled:text-gray-400`}
        onClick={() => onChange && onChange({ page: page - 1 })}
        disabled={page <= 1}
      >
        <Icon icon="formkit:left" />
      </button>

      {Array.from({ length: pages })
        .map((_, i) => i + 1)
        .map((seq) => (
          <button
            key={`pagination-${seq}`}
            className={`border rounded-xl px-3 aspect-square  h-full  flex items-center justify-center 
                      ${seq == page ? "bg-fuchsia-800/10 text-fuchsia-800" : "bg-white"}`}
            onClick={() => page != seq && onChange && onChange({ page: seq })}
            disabled={seq == page}
          >
            {seq}
          </button>
        ))}
      <button
        className={`border rounded-xl bg-white px-3 aspect-square h-full flex items-center justify-center disabled:text-gray-400`}
        onClick={() => onChange && onChange({ page: page + 1 })}
        disabled={page >= pages}
      >
        <Icon icon="formkit:right" />
      </button>
    </div>
  );
}
