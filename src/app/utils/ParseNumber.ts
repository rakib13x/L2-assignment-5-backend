export function parseNumberArrayParam(
  param: unknown,
  defaultValue: number[] = [],
): number[] {
  if (typeof param === 'string') {
    return param
      .split(',')
      .map(Number)
      .filter((num) => !isNaN(num));
  } else if (Array.isArray(param)) {
    return param.flatMap((item) =>
      typeof item === 'string'
        ? item
            .split(',')
            .map(Number)
            .filter((num) => !isNaN(num))
        : [],
    );
  } else {
    return defaultValue;
  }
}
