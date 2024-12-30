export interface ButtonProps extends React.ComponentProps<"button"> {
  ic?: unknown
}
export default function Button({ ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`flex gap-2 h-10 px-5 hover:opacity-60 rounded-xl items-center justify-center ${
        props.className ?? ""
      }`}
    />
  );
}
