import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    /**
     * The JwtStrategy does not require setting the usernameField to phone.
     * The usernameField configuration is specific to the LocalStrategy used for initial authentication (e.g., login).
     * The JwtStrategy extracts the JWT token from the request headers and validates it.
     */
    super({ usernameField: 'phone' });
  }

  async validate(phone: string, password: string): Promise<any> {
    console.log('LocalStrategy:validate: ', phone);
    const user = await this.authService.validateUser({ phone, password });

    if (!user) {
      // throw new UnauthorizedException();
    }

    delete (user as Partial<User>).password; // Remove the password from the user object before returning it to the client
    return user;
  }
}
