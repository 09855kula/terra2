"use client";
import { useEffect } from "react";
import { useCart } from "@/lib/store/cart";

// Cart is persisted to localStorage, which doesn't exist during SSR — rehydrate
// after mount instead of letting zustand read it synchronously (that's what was
// causing the server/client HTML mismatch).
export function CartHydrator() {
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);
  return null;
}
