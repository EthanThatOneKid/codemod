/**
 * Append appends a tuple to another tuple.
 *
 * @see
 * https://stackoverflow.com/questions/53985074/typescript-how-to-add-an-item-to-a-tuple#comment118209932_62561508
 */
export type Append<I extends unknown[], T extends unknown[]> = [...T, ...I];

/**
 * Generate is a helper type to generate a type from a type or a function.
 */
export type Generate<T, U extends unknown[]> =
  | T
  | ((...args: { [K in keyof U]: U[K] }) => T)
  | ((...args: { [K in keyof U]: U[K] }) => Promise<T>);
