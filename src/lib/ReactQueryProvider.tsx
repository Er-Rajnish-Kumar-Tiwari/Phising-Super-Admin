

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useState } from 'react';

import { IS_DEV_MODE, QUERY_CONFIG } from '@/constants/appConstant';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(new QueryClient(QUERY_CONFIG));

  return (
    <QueryClientProvider client={queryClient}>
      {IS_DEV_MODE && <ReactQueryDevtools initialIsOpen={false} />}
      {children}
    </QueryClientProvider>
  );
}