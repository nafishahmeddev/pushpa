import React from "react";
export interface DialogProps extends React.ComponentProps<"dialog"> {
  paperProps?: React.ComponentProps<"div">;
  onClose?: () => void;
}

const paperClassName =
  "max-w-[400px] bg-white rounded-xl group-open/dialog:opacity-100  group-open/dialog:scale-100 group-open/dialog:translate-y-0 opacity-0  transition-all flex-1  h-min translate-y-6";
export default function Dialog({
  paperProps = {},
  children,
  onClose,
  ...props
}: DialogProps) {
  paperProps.className = [paperClassName, paperProps.className].join(" ");

  return (
    <dialog
      {...props}
      className="fixed top-0 left-0  w-full h-full bg-black/25  z-20 open:visible collapse group/dialog flex justify-center overflow-auto p-6"
    >
      <div
        className="fixed top-0 left-0 h-full w-full"
        onClick={onClose && onClose}
      />

      <div {...paperProps} children={children} />
    </dialog>
  );
}
