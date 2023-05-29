/**
 * Generate is a helper type to generate a type from a type or a function.
 */
export type Generate<T, U extends unknown[]> =
  | T
  | ((...args: { [K in keyof U]: U[K] }) => T)
  | ((...args: { [K in keyof U]: U[K] }) => Promise<T>);

/**
 * generate generates a value from a value or a function.
 */
export async function generate<T, U extends unknown[]>(
  data: Generate<T, U>,
  ...args: U
): Promise<T> {
  if (data instanceof Function) {
    return await data(...args);
  }

  return data;
}
