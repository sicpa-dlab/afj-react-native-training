export const labelToLetters = (label: string) =>
  label
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()
