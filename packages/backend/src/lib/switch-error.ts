import { HttpException, HttpStatus } from '@nestjs/common';

export function switchError<T extends new () => Error, F extends Error>(
  originalError: Error,
  switches: [{ case: T; callback: (e: T) => void | Promise<void> }],
  finalError?: F,
) {
  for (const point of switches) {
    if (originalError instanceof point.case) {
      point.callback(originalError as any);
      break;
    }
  }

  console.error(originalError);

  if (finalError) throw finalError;
  throw new HttpException(
    'Internal Server error',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
