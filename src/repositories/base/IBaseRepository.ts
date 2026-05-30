export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  createMany(data: Partial<T>[]): Promise<T[]>;
  findAll(
    data: Partial<T>,
    options?: {
      sort?: Record<string, 1 | -1>;
      limit?: number;
      skip?: number;
    },
  ): Promise<T[] | null>;
  findById(id: string): Promise<T | null>;
  findOne(data: Partial<T>): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string, data: Partial<T>): Promise<T | null>;
  count(): Promise<number>;
}
