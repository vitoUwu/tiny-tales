import { CircleNotch } from "phosphor-react";

export function Loading({ size }: { size: number }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <CircleNotch className="animate-spin" size={size} />
    </div>
  );
}
