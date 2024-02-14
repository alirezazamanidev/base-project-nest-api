import {
  Injectable,

  ValidationPipe,
} from '@nestjs/common';
import ValidationException from '../exceptions/validation.exception';

@Injectable()
export class ValidationPipeErorr extends ValidationPipe {
  constructor() {
    super({
      validateCustomDecorators: true,

      exceptionFactory(errors) {
        const messages: object[] = errors.map((err) => ({
          [err.property]: Object.values(err.constraints),
        }));

        return new ValidationException(messages);
      },
    });
  }
}
