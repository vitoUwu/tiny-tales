import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  active?: boolean;
  type?: "primary" | "ghost";
};

export function Button({
  children,
  type = "primary",
  active,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      data-type={type}
      data-active={active ?? false}
      className={clsx(
        "flex items-center gap-3 rounded-md px-3 py-1 transition-colors disabled:cursor-not-allowed",
        className,
        {
          "border border-zinc-600 bg-zinc-700 text-zinc-200 disabled:border-zinc-700/50 disabled:bg-zinc-800/50":
            type === "primary" && active,
          "border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:border-zinc-700/50 disabled:bg-zinc-800/50":
            type === "primary" && !active,
        }
      )}
      {...props}
    >
      {children}
    </button>
  );
}
