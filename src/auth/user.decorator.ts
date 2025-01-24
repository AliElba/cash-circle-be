import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request: Express.Request = ctx.switchToHttp().getRequest();

  if (!request.user) {
    throw new Error('User not found on the request object. Ensure the authentication middleware is setting it.');
  }

  // If `data` is a string, check if the key exists in `request.user`
  if (typeof data === 'string') {
    if (data in request.user) {
      return request.user[data] as string;
    } else {
      throw new Error(`Property "${data}" does not exist on the user object.`);
    }
  }

  // Return the entire user object if no specific key is requested
  return request.user;
});
