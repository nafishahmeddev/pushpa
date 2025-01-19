import { Icon } from "@iconify/react";

export interface SelectProps extends React.ComponentProps<"select"> {
  label?: string;
  hint?: string;
  error?: string;
  touched?: boolean;
  containerProps?: React.ComponentProps<"div">;
}
export default function Select({
  label,
  hint = "",
  touched,
  error,
  containerProps = {},
  ...props
}: SelectProps) {
  props.id =
    props.id ??
    `select-${Math.random() * 999999}-${Math.random() * 999999}-item`;

  return (
    <div
      {...containerProps}
      className={`input flex flex-col gap-2 ${containerProps.className ?? ""}`}
    >
      {label && (
        <label className="text-sm text-gray-700" htmlFor={props.id}>
          {label}
        </label>
      )}
      <div className="flex relative">
        <select
          {...props}
          className={`bg-gray-50 rounded-lg px-3 focus:outline-2 border h-10 min-w-0 w-full appearance-none ${touched && error ? "outline-red-700 border-red-700" : ""} ${props.className}`}
        />
        <label className="absolute right-0 h-full flex items-center pe-1.5 pointer-events-none cursor-pointer text-gray-400">
          <Icon icon="formkit:down" height={18} width={18} />
        </label>
      </div>
      {(hint || (touched && error)) && (
        <small
          className={`${touched && error ? "text-red-700" : "text-gray-400"}`}
        >
          {touched && error ? error : hint}
        </small>
      )}
    </div>
  );
}
