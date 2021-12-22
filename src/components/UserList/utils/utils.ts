export function convertIntToBinary(input?: number) {
  if (!input) return [];
  const binary = input.toString(2).split('').map(Number);
  const result: number[] = [];
  for (let i = 0; i < binary.length; i++) {
    if (binary[binary.length - i - 1] == 1) {
      result.push(1 << i);
    }
  }
  return result;
}
