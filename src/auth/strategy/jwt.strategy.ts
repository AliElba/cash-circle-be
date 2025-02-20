import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import * as process from 'node:process';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

/**
 * JWT Strategy for Passport, How it works step by step
 *
 * The @UseGuards(JwtAuthGuard) decorator is used to protect endpoints by requiring a valid JWT (JSON Web Token) for access.
 *
 * Here's a step-by-step explanation of how it works:
 * Guard Activation: When a request is made to an endpoint decorated with @UseGuards(JwtAuthGuard),
 * the JwtAuthGuard is activated. This guard extends the AuthGuard from @nestjs/passport,
 * which integrates with the Passport.js authentication middleware.
 * JWT Strategy: The JwtAuthGuard uses the JwtStrategy defined in src/auth/strategy/jwt.strategy.ts.
 * This strategy extracts the JWT from the request's Authorization header using ExtractJwt.fromAuthHeaderAsBearerToken().
 * Token Validation: The JwtStrategy validates the token using the secret key (process.env.JWT_SECRET).
 * If the token is valid, the validate method is called with the decoded payload.
 * User Retrieval: In the validate method, the user ID (payload.sub) is used to fetch the user from the database using Prisma.
 * The user data is then returned, excluding the password.
 * Request User: The authenticated user object is attached to the request object (request.user).
 * Decorator Usage: The GetUser decorator can then be used in controller methods to access the authenticated user. It retrieves the user from request.user and can optionally return specific properties if a key is provided.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  async validate(payload: { sub: string; phone: string }) {
    const user = (await this.prisma.user.findUnique({
      where: { id: payload.sub },
    })) as Partial<User>;

    delete user.password;
    return user;
  }
}
