/**
 * @param {number} min (inclusive)
 * @param {number} max (exclusive)
 */
export const getRandomFloat = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};
