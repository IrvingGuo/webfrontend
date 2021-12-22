export function getCascaderLevel(level?: string) {
  if (!level) {
    return [];
  }
  const split = level.split('.');
  const result = [];
  if (split.length == 1 || split.length == 2) {
    result.push(level);
  } else if (split.length == 3) {
    result.push(split.slice(0, 2).join('.'));
    result.push(level);
  } else {
    console.error('error level length', level);
  }
  return result;
}
