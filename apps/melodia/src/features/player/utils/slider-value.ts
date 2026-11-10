/** O Slider aceita um valor ou um array; reducers de um polegar usam isto. */
export function toSingleSliderValue(value: number | readonly number[]): number {
  if (typeof value === 'number') return value;
  return value[0] ?? 0;
}
