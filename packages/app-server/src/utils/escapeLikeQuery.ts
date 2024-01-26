export function escapeLikeQuery(str) {
  return str?.replace(/([\\%_])/g, '\\$1');
}
