import { forwardRef, useState, type TextareaHTMLAttributes } from "react";

export const PostContentInput = forwardRef<
  HTMLTextAreaElement,
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className">
>(function TextInput(props, ref) {
  const [inputLength, setInputLength] = useState(
    typeof props.value === "string" ? props.value.length : 0
  );

  return (
    <div className="relative">
      <textarea
        {...props}
        rows={4}
        maxLength={256}
        ref={ref}
        onChange={(e) => setInputLength(e.currentTarget.value.length)}
        className="no-scrollbar max-h-96 w-full resize-none scroll-p-3 overflow-y-scroll rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-300 disabled:cursor-not-allowed disabled:border-zinc-700/50 disabled:bg-zinc-800/50"
      />
      <span className="absolute bottom-3 right-3 select-none text-sm text-zinc-400">
        {inputLength}/256
      </span>
    </div>
  );
});
