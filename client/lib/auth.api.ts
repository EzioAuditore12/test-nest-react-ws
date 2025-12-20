import * as s from 'standard-parse';

import { fetch, FetchProps, HttpMethods } from './fetch';

import { env } from '@/env';

import { useAuthStore } from '@/store/auth';

import { refreshTokensApi } from '@/features/auth/common/api/refresh-tokens.api';

interface AuthenticatedFetchProps extends Omit<FetchProps, 'body' | 'method'> {
  baseUrl?: string;
  url: string;
  responseStatus?: number;
  method: HttpMethods;
  body?: object;
}

let refreshPromise: Promise<void> | null = null;

export const authenticatedFetch = async ({
  baseUrl = env.API_URL,
  url,
  headers,
  responseStatus = 401,
  body,
  method,
  ...props
}: AuthenticatedFetchProps) => {
  const accessToken = useAuthStore.getState().tokens?.accessToken;

  if (!accessToken) throw new Error('No authentication token provided');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    ...(headers || {}),
  };

  const requestOptions = {
    method,
    body: body ? JSON.stringify(body) : undefined,
  };

  const apiUrl = `${baseUrl}/${url}`;

  let response = await fetch(apiUrl, {
    ...requestOptions,
    headers: authHeaders,
    ...props,
  });

  if (response.status === responseStatus) {
    try {
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshToken = useAuthStore.getState().tokens?.refreshToken;

          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await refreshTokensApi({ refreshToken });

          useAuthStore.getState().setTokens({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        })();
      }

      await refreshPromise;

      refreshPromise = null;

      const newAccessToken = useAuthStore.getState().tokens?.accessToken;

      authHeaders.Authorization = `Bearer ${newAccessToken}`;

      response = await fetch(apiUrl, {
        ...requestOptions,
        headers: authHeaders,
        ...props,
      });
    } catch (error) {
      refreshPromise = null;
      alert('Session expired. Please login again.');
      useAuthStore.getState().logout();
      throw error;
    }
  }

  const json = await response.json();

  return json;
};

interface TypedAuthenticatedFetchProps<
  S extends s.StandardSchemaV1,
> extends AuthenticatedFetchProps {
  method: HttpMethods;
  schema: S;
  body?: object;
  params?: object;
}

export const authenticatedTypedFetch = async <S extends s.StandardSchemaV1>({
  baseUrl = `${env.API_URL}`,
  url,
  headers,
  responseStatus = 401,
  body,
  schema,
  params,
  method,
  ...props
}: TypedAuthenticatedFetchProps<S>): Promise<s.StandardSchemaV1.InferOutput<S>> => {
  const accessToken = useAuthStore.getState().tokens?.accessToken;

  if (!accessToken) throw new Error('No authentication token provided');

  let authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    ...(headers || {}),
  };

  if (params !== undefined) {
    const paramsValues = new URLSearchParams(params as Record<string, string>).toString();

    url = url + (url.includes('?') ? '&' : '?') + paramsValues;
  }

  const requestOptions = {
    method,
    body: body ? JSON.stringify(body) : undefined,
  };

  const apiUrl = `${baseUrl}/${url}`;

  let response = await fetch(apiUrl, {
    ...requestOptions,
    headers: authHeaders,
    ...props,
  });

  if (response.status === responseStatus) {
    try {
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshToken = useAuthStore.getState().tokens?.refreshToken;

          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await refreshTokensApi({ refreshToken });

          useAuthStore.getState().setTokens({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        })();
      }

      await refreshPromise;
      refreshPromise = null;

      const newAccessToken = useAuthStore.getState().tokens?.accessToken;

      authHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newAccessToken}`,
        ...(headers || {}),
      };

      response = await fetch(apiUrl, {
        ...requestOptions,
        headers: authHeaders,
        ...props,
      });
    } catch (error) {
      refreshPromise = null;
      alert('Session expired. Please login again.');
      useAuthStore.getState().logout();
      throw error;
    }
  }

  const json = await response.json();

  const result = s.safeParse(schema, json);

  if (result.issues) throw new Error(JSON.stringify(result.issues));

  return result.value;
};
