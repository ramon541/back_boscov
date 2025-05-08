import { Request, Response, NextFunction } from "express";

export interface IResponse<T> {
  success: boolean;
  message: string | Array<string>;
  data?: T;
}

export interface IApiController<T> {
  create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  get: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
