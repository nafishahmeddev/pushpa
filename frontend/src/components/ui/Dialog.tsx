import React, { useEffect } from "react";
export interface DialogProps extends React.ComponentProps<"dialog"> {
  paperProps?: React.ComponentProps<"div">;
  onClose?: () => void;
}

const paperClassName =
  "bg-white rounded-2xl group-open/dialog:scale-100 group-open/dialog:opacity-100 scale-50 opacity-0 transition-all flex-1 max-w-[400px] h-min";
export default function Dialog({
  paperProps = {},
  children,
  onClose,
  ...props
}: DialogProps) {
  const ref = React.createRef<HTMLDivElement>();
  paperProps.className = [paperClassName, paperProps.className].join(" ");

  useEffect(() => {
    if (ref.current) {
      ref.current.id = "dialog-" + Math.round(Math.random() * 999999999);
    }
  }, [ref]);
  return (
    <dialog
      {...props}
      className="fixed top-0 left-0  w-full h-full bg-black/25  z-20 open:visible collapse group/dialog transition-all flex justify-center overflow-auto p-6"
    >
      <div
        className="fixed top-0 left-0 h-full w-full"
        onClick={onClose && onClose}
      />

      <div {...paperProps} ref={ref} children={children} />
    </dialog>
  );
}
