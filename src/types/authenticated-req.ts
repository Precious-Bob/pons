import { Request } from "express";
import { BusinessEntity } from "../entities/business.entity";

export interface AuthenticatedReq extends Request {
  business: BusinessEntity;
}
