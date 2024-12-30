import { FieldMetaProps } from "formik";
import { Icon } from "@iconify/react";
import { useState } from "react";
export interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  hint?: string;
  meta?: FieldMetaProps<"input">;
  containerProps?: React.ComponentProps<"div">;
}
export default function Input({
  label,
  hint = "",
  meta,
  containerProps = {},
  ...props
}: InputProps) {
  const touched: boolean = meta?.touched ?? false;
  const error: string = meta?.error ?? "";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      {...containerProps}
      className={`input flex flex-col gap-2 ${containerProps.className ?? ""}`}
    >
      {label && <label className="text-sm text-gray-700">{label}</label>}
      <div className="flex relative">
        <input
          {...props}
          className={`bg-gray-50 rounded-xl py-2 px-3 focus:outline-2 border h-10 min-w-0 w-full flex-1 ${
            touched && error ? "outline-red-700 border-red-700" : ""
          } ${props.className}`}
          type={
            props.type == "password"
              ? showPassword
                ? "text"
                : "password"
              : props.type
          }
        />
        {props.type == "password" && (
          <button
            className="pe-3 absolute right-0 top-0 h-full flex items-center justify-center text-gray-400 hover:opacity-50"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            <Icon icon={showPassword ? "lucide:eye" : "lucide:eye-off"} />
          </button>
        )}
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
