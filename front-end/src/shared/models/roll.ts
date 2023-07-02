export interface Roll {
  id: number
  name: string
  completed_at: Date
  student_roll_states: RollEntry[]
}

export interface RollInput {
  student_roll_states: RollEntry[]
}

export interface RollEntry {
  student_id: number
  roll_state: RolllStateType
}

export type RolllStateType = "unmark" | "present" | "absent" | "late"
