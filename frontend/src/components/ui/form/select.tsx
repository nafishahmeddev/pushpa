import { FieldMetaProps } from "formik";

export interface SelectProps extends React.ComponentProps<"select"> {
  label?: string;
  hint?: string;
  meta?: FieldMetaProps<"select">;
  containerProps?: React.ComponentProps<"div">;
}
export default function Select({
  label,
  hint = "",
  meta,
  containerProps = {},
  ...props
}: SelectProps) {
  const touched: boolean = meta?.touched ?? false;
  const error: string = meta?.error ?? "";

  return (
    <div
      {...containerProps}
      className={`input flex flex-col gap-2 ${containerProps.className ?? ""}`}
    >
      {label && <label className="text-sm text-gray-700">{label}</label>}
      <select
        {...props}
        className={`bg-gray-50 rounded-xl py-2 px-3 focus:outline-2 border h-10 min-w-0 w-full ${
          touched && error ? "outline-red-700 border-red-700" : ""
        } ${props.className}`}
      />
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
