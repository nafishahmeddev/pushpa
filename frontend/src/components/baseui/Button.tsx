import { Icon } from "@iconify/react";
export interface ButtonProps extends React.ComponentProps<"button"> {
  ask?: boolean | string;
  loading?: boolean;
}
export default function Button({
  ask = false,
  loading = false,
  ...props
}: ButtonProps) {
  if (props.onClick && ask) {
    const oldClick = props.onClick;
    props.onClick = (...args) => {
      if (confirm(typeof ask == "string" ? ask : "Are you sure?")) {
        oldClick(...args);
      }
    };
  }
  return (
    <button
      {...props}
      className={`flex text-nowrap gap-2 h-10 px-5 hover:opacity-80 disabled:opacity-60 disabled:hover:opacity-60 rounded-xl overflow-hidden relative items-center justify-center ${props.className ?? ""}`}
    >
      {loading && (
        <span className="bg-inherit absolute top-0 left-0 h-full w-full flex items-center justify-center">
          <Icon icon="eos-icons:three-dots-loading" height={35} width={40} />
        </span>
      )}
      {props.children}
    </button>
  );
}
