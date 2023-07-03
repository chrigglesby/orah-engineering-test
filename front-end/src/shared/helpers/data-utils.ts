import { RollEntry } from "shared/models/roll"
import { StateList } from "staff-app/components/roll-state/roll-state-list.component"

export const studentRollsToRollStateList = (studentRolls: RollEntry[]): StateList[] => {
    let rollTally = {
      all: 0,
      present: 0,
      late: 0,
      absent: 0,
      unmark: 0
    }
    
    for (let i = 0; i < studentRolls.length; i++) {
      rollTally[studentRolls[i].roll_state] = rollTally[studentRolls[i].roll_state] + 1
    }
  
    return [
      { type: "all", count: studentRolls.length },
      { type: "present", count: rollTally.present },
      { type: "late", count: rollTally.late },
      { type: "absent", count: rollTally.absent },
      { type: "unmark", count: rollTally.unmark }
    ]
  }