import { Header } from "@/components/Header";
import { CartSidebar } from "@/components/CartSidebar";
import { CartHydrator } from "@/components/CartHydrator";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <CartHydrator />
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <CartSidebar />
    </div>
  );
}
