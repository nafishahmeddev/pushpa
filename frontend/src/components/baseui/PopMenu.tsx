import { useClickOutside } from "@app/hooks/useClickOutside";
import React, { FC, RefObject, useEffect, useRef, useState } from "react";

type PopMenuContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef?: RefObject<HTMLElement | null>;
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
  const triggerRef = useRef<HTMLElement>(null);
  return (
    <PropMenuContext.Provider
      value={{
        open: open,
        setOpen: (open: boolean) => setOpen(open),
        triggerRef: triggerRef,
      }}
    >
      <div className="relative">{children}</div>
    </PropMenuContext.Provider>
  );
}

type PopMenuTriggerProps = {
  children: React.ReactNode;
};
export const PopMenuTrigger: FC<PopMenuTriggerProps> = ({ children }) => {
  const { setOpen, triggerRef } = React.useContext(PropMenuContext);
  useClickOutside(triggerRef as unknown as RefObject<HTMLElement>, () => {
    setOpen(false);
  });
  let child = children;
  if (
    React.isValidElement<{
      onClick?: () => void;
      style: { [key: string]: string };
      ref: RefObject<HTMLElement | null>;
    }>(children)
  ) {
    child = React.cloneElement(children, {
      onClick: () => setOpen(true),
      style: {
        ...children.props.style,
        anchorName: "--my-anchor",
      },
      ref: triggerRef,
    });
  }
  return <React.Fragment>{child}</React.Fragment>;
};

export type PopMenuContentProps = {
  children: React.ReactNode;
};
export const PopMenuContent: FC<PopMenuContentProps> = ({ children }) => {
  const { open, triggerRef } = React.useContext(PropMenuContext);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [pos, setPos] = useState<{
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  }>({});
  const calculatePosition = () => {
    if (triggerRef?.current && ref.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const content = ref.current.getBoundingClientRect();
      const h = window.innerHeight;
      const w = window.innerWidth;

      const pos: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
      } = {
        left: undefined,
        right: undefined,
        top: undefined,
        bottom: undefined,
      };

      if (w < rect.left + content.width) {
        pos.right = 0;
      } else {
        pos.left = 0;
      }

      if (h < rect.top + content.height) {
        pos.bottom = open ? 35 : 50;
      } else {
        pos.top = open ? 35 : 50;
      }
      setPos(pos);
    }
  };
  useEffect(() => {
    calculatePosition();
  }, [triggerRef, open]);

  useEffect(() => {
    window.addEventListener("resize", calculatePosition);
    return () => {
      window.removeEventListener("resize", calculatePosition);
    };
  }, []);
  return (
    <div
      ref={ref}
      className={`${open ? "visible opacity-100" : "collapse opacity-0"} bg-white border rounded-xl whitespace-nowrap absolute z-10 transition-all overflow-hidden`}
      style={{ ...pos }}
    >
      <ul className="py-2" ref={listRef}>
        {children}
      </ul>
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
          "px-4 flex py-2.5 min-w-36 hover:opacity-20 cursor-pointer gap-2.5 items-center text-sm",
          props.className,
        ].join(" ")}
      />
    </li>
  );
};
