export type TClient = ReturnType<typeof getClient>;
export type HTTP_METHOD = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export const getClient = () => {
  return {
    request: <T>(method: HTTP_METHOD, url: string, body: any = null): Promise<T> => {
      return fetch(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
      }).then(r => r.json());
    },
    get<T>(url: string): Promise<T> {
      return this.request('GET', url);
    },
    post<T, B = any>(url: string, body: B): Promise<T> {
      return this.request('POST', url, body);
    },
    put<T, B = any>(url: string, body: B): Promise<T> {
      return this.request('PUT', url, body);
    },
    patch<T, B = any>(url: string, body: Partial<B>): Promise<T> {
      return this.request('PATCH', url, body);
    },
    delete<T>(url: string, body: Record<any, any>): Promise<T> {
      return this.request('DELETE', url, body);
    }
  };
};
