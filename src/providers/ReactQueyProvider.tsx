"use client";
import {
  QueryClient,
  QueryClientProvider,
  QueryClientConfig,
} from "@tanstack/react-query";
import { useState } from "react";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";s

export const ReactQueryProvider = ({
  children,
  config,
}: React.PropsWithChildren<{ config?: QueryClientConfig }>) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        ...config,
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};
