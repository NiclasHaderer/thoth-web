import { TClient } from './Client';

export const withErrorHandler = <C extends TClient>(client: C, errorCallback: (error: any) => void): C => {
  return {
    ...client,
    request<T>(...args: Parameters<TClient['request']>): Promise<T> {
      const response = client.request<T>(...args);
      response.catch(errorCallback);
      return response;
    }
  };

};
