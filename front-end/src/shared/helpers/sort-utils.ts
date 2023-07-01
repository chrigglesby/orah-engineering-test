// Sorting function for strings, may be used with array .sort()
export const sortAlphabetical = (a: string, b: string, descending: boolean = false): number => {
    let weight = 0
    a = a.toLowerCase()
    b = b.toLowerCase()
    if (a < b) weight = -1
    if (a > b) weight = 1
    if (descending && weight !== 0) return weight * -1 // Invert weight to achieve descending order
    return weight
  }