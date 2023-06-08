/**
 * Append appends a tuple to another tuple.
 *
 * @see
 * https://stackoverflow.com/questions/53985074/typescript-how-to-add-an-item-to-a-tuple#comment118209932_62561508
 */
export type Append<I extends unknown[], T extends unknown[]> = [...I, ...T];
