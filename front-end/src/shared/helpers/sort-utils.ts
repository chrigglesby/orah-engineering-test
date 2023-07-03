import { Person } from "shared/models/person"

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

export const sortStudents = (students: Person[], by: string, descending: boolean) => {
  students.sort((a, b) => {
    let nameA = a.first_name + a.last_name
    let nameB = b.first_name + b.last_name

    if (by === 'lastName') {
      nameA = a.last_name + a.first_name
      nameB = b.last_name + b.first_name
    }

    return sortAlphabetical(nameA, nameB, descending)
  })

  return students
}