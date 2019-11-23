export function ucFirstLetter(givenString: string): string {
  if (!givenString) {
    return givenString;
  }
  return givenString[0].toUpperCase() + givenString.slice(1);
}
