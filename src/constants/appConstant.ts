import type { QueryClientConfig } from '@tanstack/react-query';

export const IS_DEV_MODE = process.env.NODE_ENV === 'development';

export const QUERY_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1 * 60 * 1000, // 1 Minute
    },
  },
};