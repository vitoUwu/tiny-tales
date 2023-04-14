export function Tag({ children }: { children: string }) {
  return (
    <span className="h-fit rounded-full border border-emerald-400 bg-emerald-400/10 px-2 py-[1px] text-xs text-emerald-400">
      {children}
    </span>
  );
}
