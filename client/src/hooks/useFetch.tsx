import { useState } from 'react';

type RequestOptions<T> = {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH';
  body?: T;
  onSuccess?: (data: any) => void;
};
export function useFetch<T = unknown>() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const request = async ({
    endpoint,
    method = 'GET',
    body,
    onSuccess,
  }: RequestOptions<T>) => {
    setStatus('Loading...');
    setError(null);
    setLoading(true);

    try {
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (
        body &&
        (method === 'POST' || method === 'PUT' || method === 'PATCH')
      ) {
        options.body = JSON.stringify(body);
      }
      const response = await fetch(endpoint, options);

      if (!response.ok) throw new Error('Request failed.');

      let data: any;
      if (response.headers.get('Content-Type')?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      setStatus('Success');
      if (onSuccess) onSuccess(data);
    } catch (err: any) {
      setError(err.message);
      console.log('error', err);
      setStatus('Error');
    } finally {
      setLoading(false);
    }
  };

  return { request, status, error, loading };
}
