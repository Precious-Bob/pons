import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { Request } from "express";
import { BusinessesService } from "../businesses/businesses.service";
import { BusinessEntity } from "../entities/business.entity";
import { BusinessStatus } from "../enums/business-status.enum";
import { AuthenticatedReq } from "../types/authenticated-req";

// Augment Express's Request so `request.business` is typed downstream
declare module "express" {
  interface Request {
    business?: BusinessEntity;
  }
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly businessesService: BusinessesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedReq>();

    const apiKey = this.extractApiKey(request);
    if (!apiKey) {
      throw new UnauthorizedException({
        code: "API_KEY_REQUIRED",
        message: "API key is required",
      });
    }

    const business = await this.businessesService.findByApiKey(apiKey);
    if (!business) {
      throw new UnauthorizedException({
        code: "INVALID_API_KEY",
        message: "Invalid API key",
      });
    }

    // Allowlist, not blocklist — anything other than ACTIVE is rejected,
    // including future statuses you haven't added a branch for yet.
    if (business.status !== BusinessStatus.ACTIVE) {
      throw new ForbiddenException({
        code: "BUSINESS_SUSPENDED",
        message: "Business is suspended",
      });
    }

    request.business = business;

    return true;
  }

  private extractApiKey(request: Request): string | null {
    const header = request.headers["x-api-key"];

    if (!header || Array.isArray(header)) {
      return null;
    }

    const trimmed = header.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
}
