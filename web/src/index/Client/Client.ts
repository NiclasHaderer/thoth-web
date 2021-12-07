export type HTTP_METHOD = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type TClient = {
  request<T>(method: HTTP_METHOD, url: string, body?: any): Promise<T>
  get<T>(url: string): Promise<T>
  post<T, B = any>(url: string, body: B): Promise<T>
  patch<T, B = any>(url: string, body: Partial<B>): Promise<T>
  put<T, B = any>(url: string, body: B): Promise<T>
  delete<T, B = any>(url: string, body: B): Promise<T>
}


export const getClient = () => {

  const executeRequest = (method: HTTP_METHOD, url: string, body: any) => {
    const isJson = typeof body === 'object';
    return fetch(url, {
      method,
      body: isJson ? JSON.stringify(body) : body,
      headers: {
        ...(isJson ? {'Content-Type': 'application/json'} : {})
      }
    });
  };


  return {
    request: <T>(method: HTTP_METHOD, url: string, body: any = undefined): Promise<T> => {
      return new Promise<T>(async (resolve, reject) => {
        const response = await executeRequest(method, url, body);
        if (response.status >= 400) {
          reject(response);
        }
        resolve(response.json());
      });

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
