export interface ButtonProps extends React.ComponentProps<"button"> {
  ask?: boolean | string;
}
export default function Button({ ask = false, ...props }: ButtonProps) {
  if (props.onClick && ask) {
    const oldClick = props.onClick;
    props.onClick = (...seg) => {
      if (confirm(typeof ask == "string" ? ask : "Are you sure?")) {
        oldClick(...seg);
      }
    };
  }
  return <button {...props} className={`flex gap-2 h-10 px-5 hover:opacity-60 rounded-xl items-center justify-center ${props.className ?? ""}`} />;
}
