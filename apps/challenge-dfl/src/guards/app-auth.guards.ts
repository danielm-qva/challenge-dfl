import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';

export class AppAuthGuards implements CanActivate {
  constructor(@Inject(JwtService) private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.tokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not Found');
    }
    try {
      const isValid = await this.jwtService.verify(token, {
        secret: process.env.APP_JWT_SECRET,
      });
      if (isValid) {
        request['user'] = isValid;
        return true;
      }
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('The token has expired');
      } else if (e instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Token is not Valid');
      }
      throw new BadRequestException('Error validating token');
    }
  }

  private tokenFromHeader(req: Request): string | undefined {
    const [type, token] = req?.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
