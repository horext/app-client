export interface IPage<T> {
    offset: number;
    limit: number;
    totalElements: number;
    pageSize: number;
    totalPages: number;
    content: T[];
  }
