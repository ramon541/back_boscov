export interface IResponse<T> {
  success: boolean;
  message: string | Array<string>;
  data?: T;
}
