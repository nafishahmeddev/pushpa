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
    props.onClick = (...seg) => {
      if (confirm(typeof ask == "string" ? ask : "Are you sure?")) {
        oldClick(...seg);
      }
    };
  }
  return (
    <button
      {...props}
      className={`flex gap-2 h-10 px-5 hover:opacity-60 disabled:opacity-60 rounded-xl items-center justify-center ${props.className ?? ""}`}
    >
      {loading ? (
        <Icon icon="eos-icons:three-dots-loading" height={35} width={40} />
      ) : (
        props.children
      )}
    </button>
  );
}
