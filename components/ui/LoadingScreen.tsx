export function LoadingScreen({ children = "Loading…" }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center text-[#616A5C]">
      {children}
    </div>
  );
}
