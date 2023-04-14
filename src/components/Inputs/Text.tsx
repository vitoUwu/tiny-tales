import { forwardRef, type InputHTMLAttributes } from "react";

export const TextInput = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type">
>(function TextInput(props, ref) {
  return (
    <input
      ref={ref}
      className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 disabled:cursor-not-allowed disabled:border-zinc-700/50 disabled:bg-zinc-800/50"
      type="text"
      {...props}
    />
  );
});
