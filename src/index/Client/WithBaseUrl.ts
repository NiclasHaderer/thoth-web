import { HTTP_METHOD, TClient } from './Client';

export const withBaseUrl = <C extends TClient>(client: C, baseURL: string): C => {
  return {
    ...client,
    request<T>(method: HTTP_METHOD, url: string, body: any = null): Promise<T> {
      return client.request<T>(method, `${baseURL}/${url}`, body)
    }
  };
};