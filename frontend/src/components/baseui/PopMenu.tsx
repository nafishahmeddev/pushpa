import { useClickOutside } from "@app/hooks/useClickOutside";
import React, { FC, useRef, useState } from "react";

type PopMenuContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
const PropMenuContext = React.createContext<PopMenuContextType>({
  open: false,
  setOpen: () => {},
});

export type PopMenuProps = {
  children: React.ReactNode;
};
export default function PopMenu({ children }: PopMenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <PropMenuContext.Provider
      value={{ open: open, setOpen: (open: boolean) => setOpen(open) }}
    >
      <div className="relative">{children}</div>
    </PropMenuContext.Provider>
  );
}

type PopMenuTriggerProps = {
  children: React.ReactNode;
};
export const PopMenuTrigger: FC<PopMenuTriggerProps> = ({ children }) => {
  const { setOpen } = React.useContext(PropMenuContext);
  const child = React.isValidElement<{ onClick?: () => void }>(children)
    ? React.cloneElement(children, {
        onClick: () => setOpen(true), // Ensure `setOpen` is defined
      })
    : children;
  return <React.Fragment>{child}</React.Fragment>;
};

export type PopMenuContentProps = {
  children: React.ReactNode;
};
export const PopMenuContent: FC<PopMenuContentProps> = ({ children }) => {
  const { open, setOpen } = React.useContext(PropMenuContext);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => {
    setOpen(false);
  });
  return (
    <div
      ref={ref}
      className={`${open ? "block" : "hidden"} absolute z-10 top-10 left-0 bg-white border rounded-xl whitespace-nowrap`}
    >
      <ul className="py-2">{children}</ul>
    </div>
  );
};

export type PopMenuItemProps = {
  children: React.ReactNode;
};

export const PopMenuItem: FC<PopMenuItemProps & React.ComponentProps<"a">> = ({
  ...props
}) => {
  return (
    <li className="border-b [&:last-child]:border-b-0">
      <a
        {...props}
        className={[
          "px-4 flex py-2 min-w-36 hover:opacity-20 cursor-pointer gap-2.5 items-center ",
          props.className,
        ].join(" ")}
      />
    </li>
  );
};
