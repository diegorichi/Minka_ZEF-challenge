import { Request } from "express";

export interface ZEFRequest<user = any> extends Request {
  user: any;
}
