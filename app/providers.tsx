"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { trpc } from "@/lib/trpc/client";
import { getBaseUrl } from "@/lib/trpc/shared";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          // Default stale-immediately + refetch-on-focus/mount means every
          // remount or tab-back-in refires every query on the page. Most of
          // what we fetch (menu, profile, order lists/detail) doesn't change
          // second-to-second, so give everything a baseline cache window and
          // let individual queries override where they genuinely need to be
          // fresher (or explicitly invalidate after the mutation that
          // changes them, which always bypasses staleTime regardless).
          queries: { retry: false, staleTime: 30_000 },
        },
      })
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
