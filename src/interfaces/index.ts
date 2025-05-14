import { RequestHandler } from "express";

export interface IResponse<T> {
  success: boolean;
  message: string | Array<string>;
  data?: T;
}

export interface IApiController<T> {
  create: RequestHandler;
  get: RequestHandler;
  getAll: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
}
