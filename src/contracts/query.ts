import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';

export type MutationOptionsType = Omit<
  UseMutationOptions<AxiosResponse<any, any>, unknown, unknown>,
  'mutationFn'
>;

export type QueryOptionsType = Omit<
  UseQueryOptions<AxiosResponse<any, any>, unknown, AxiosResponse<any, any>>,
  'initialData'
>;

export type QueryOptionsGenricType<T, E> = UseQueryOptions<T, E>;