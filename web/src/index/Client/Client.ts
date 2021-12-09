export type HTTP_METHOD = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type TClient = {
  request<T>(method: HTTP_METHOD, url: string, body?: any): Promise<T | undefined>
  get<T>(url: string): Promise<T | undefined>
  post<T, B = any>(url: string, body: B): Promise<T | undefined>
  patch<T, B = any>(url: string, body: Partial<B>): Promise<T | undefined>
  put<T, B = any>(url: string, body: B): Promise<T | undefined>
  delete<T, B = any>(url: string, body: B): Promise<T | undefined>
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
    request<T>(method: HTTP_METHOD, url: string, body: any = undefined): Promise<T | undefined> {
      return new Promise<T>(async (resolve, reject) => {
        executeRequest(method, url, body)
          .then(res => {
            if (res.status >= 400) {
              reject(res);
            }
            resolve(res.json());
          })
          .catch(reject);
      });

    },
    get<T>(url: string): Promise<T | undefined> {
      return this.request('GET', url);
    },
    post<T, B = any>(url: string, body: B): Promise<T | undefined> {
      return this.request('POST', url, body);
    },
    put<T, B = any>(url: string, body: B): Promise<T | undefined> {
      return this.request('PUT', url, body);
    },
    patch<T, B = any>(url: string, body: Partial<B>): Promise<T | undefined> {
      return this.request('PATCH', url, body);
    },
    delete<T>(url: string, body: Record<any, any>): Promise<T | undefined> {
      return this.request('DELETE', url, body);
    }
  };
};
