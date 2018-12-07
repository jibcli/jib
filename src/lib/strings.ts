
export function classCase(str: string) {
  return str.replace(/^\W+/, '').replace(/(?:^\w|[A-Z]|_\w|\b\w|\s+)/g, (match, index) => {
    return +match === 0 ? '' : match.toUpperCase();
  }).replace(/[^a-z]/ig, '');
}
