export function parseQueryParamToInt(
  param: unknown,
  defaultValue: number,
): number {
  if (typeof param === 'string') {
    const parsed = parseInt(param, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  } else if (Array.isArray(param) && typeof param[0] === 'string') {
    const parsed = parseInt(param[0], 10);
    return isNaN(parsed) ? defaultValue : parsed;
  } else if (typeof param === 'number') {
    return param;
  } else {
    return defaultValue;
  }
}
