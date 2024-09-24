export function parseStringArrayParam(param: unknown): string[] {
  if (typeof param === 'string') {
    return param.split(',');
  } else if (Array.isArray(param)) {
    return param.flatMap((item) =>
      typeof item === 'string' ? item.split(',') : [],
    );
  } else {
    return [];
  }
}
