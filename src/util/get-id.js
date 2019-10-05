export function getId() {
  return `f${(~~(Math.random() * 1e8)).toString(16)}`;
}
