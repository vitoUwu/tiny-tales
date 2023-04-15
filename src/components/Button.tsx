import type { ButtonHTMLAttributes } from "react";

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "type"
> & {
  active?: boolean;
  type?: "primary" | "ghost";
};

export function Button({
  children,
  type = "primary",
  active,
  ...props
}: ButtonProps) {
  return (
    <button
      data-type={type}
      data-active={active ?? false}
      className="flex items-center gap-3 rounded-md px-3 py-1 transition-colors disabled:cursor-not-allowed data-[type='primary']:border data-[type='primary']:border-zinc-700 data-[active='true']:bg-zinc-700 data-[type='primary']:bg-zinc-800 data-[type='primary']:hover:bg-zinc-700 data-[type='primary']:disabled:border-zinc-700/50 data-[type='primary']:disabled:bg-zinc-800/50"
      {...props}
    >
      {children}
    </button>
  );
}
