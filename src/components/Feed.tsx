import type { ReactNode } from "react";

type FeedProps = {
  children: ReactNode;
};

export function Feed({ children }: FeedProps) {
  return (
    <section className="no-scrollbar flex h-full flex-col items-center gap-3 overflow-y-scroll shadow-inner">
      {children}
    </section>
  );
}
