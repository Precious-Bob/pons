import { Request } from "express";
import { BusinessEntity } from "../entities/business.entity";

export interface AuthenticatedRequest extends Request {
  business: BusinessEntity;
}
