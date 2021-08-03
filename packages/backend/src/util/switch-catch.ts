export async function switchCatch<
  T extends Error,
  Z extends new () => Error,
  S extends {
    instance: Z;
    callback: (error: Z) => Promise<void> | void;
  }[],
>(originalError: T, cases: S) {
  for (const option of cases) {
    if (originalError instanceof option.instance) {
      return option.callback(
        originalError as unknown as typeof option.instance,
      );
    }
  }
  throw originalError;
}
