/**
 * Generate is a helper type to generate a type from a type or a function.
 */
export type Generate<T, U extends unknown[]> =
  | T
  | ((...args: { [K in keyof U]: U[K] }) => T)
  | ((...args: { [K in keyof U]: U[K] }) => Promise<T>);

/**
 * Generated infers the type of a generated value.
 */
export type Generated<T> = T extends Generate<infer U, unknown[]> ? U
  : never;

/**
 * ArgsOf infers the type of the arguments of a generated function.
 */
export type ArgsOf<T> = T extends Generate<unknown, infer U> ? U : never;

/**
 * generateObject generates an object from a value or a function.
 */
export async function generateObject<
  T extends { [K in keyof T]: Generate<unknown, unknown[]> },
>(
  object: T,
  argsMap: { [K in keyof T]: ArgsOf<T[K]> },
): Promise<{ [K in keyof T]: Generated<T[K]> }> {
  const entries = Object.entries(object) as [
    keyof T,
    Generate<T[keyof T], ArgsOf<T[keyof T]>>,
  ][];
  const promises = entries.map(([key, value]) =>
    (async () => {
      const args = argsMap[key];
      const generated = await generate(value, ...args);
      return [key, generated] as const;
    })()
  );
  const generatedEntries = await Promise.all(promises);
  return Object.fromEntries(generatedEntries) as {
    [K in keyof T]: Generated<T[K]>;
  };
}

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
