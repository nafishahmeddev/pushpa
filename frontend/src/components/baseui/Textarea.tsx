export interface InputProps extends React.ComponentProps<"textarea"> {
  label?: string;
  hint?: string;
  error?: string;
  touched?: boolean;
  containerProps?: React.ComponentProps<"div">;
}
export default function Textarea({
  label,
  hint = "",
  error,
  touched,
  containerProps = {},
  ...props
}: InputProps) {
  return (
    <div
      {...containerProps}
      className={`input flex flex-col gap-2 ${containerProps.className ?? ""}`}
    >
      {label && <label className="text-sm text-gray-700">{label}</label>}
      <div className="flex relative">
        <textarea
          {...props}
          className={`bg-gray-50 rounded-lg py-2 px-3 focus:outline-2 border min-w-0 w-full flex-1 ${touched && error ? "outline-red-700 border-red-700" : ""} ${props.className}`}
          children={props.value}
        />
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
