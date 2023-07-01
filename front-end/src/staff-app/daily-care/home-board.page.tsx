import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { sortAlphabetical } from "shared/helpers/sort-utils"
import { StateList } from "staff-app/components/roll-state/roll-state-list.component"
import { RollEntry, RolllStateType } from "shared/models/roll"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [sortDirectionDescending, setSortDirectionDescending] = useState(false)
  const [sortByOptionIndex, setSortByOptionIndex] = useState(0)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [searchTerm, setSearchTerm] = useState('')
  const [roll, setRoll] = useState<RollEntry[]>([])

  const sortByOptions = ['firstName', 'lastName']
  const sortBy = sortByOptions[sortByOptionIndex]
  
  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    if (data?.students) {
      // Generate roll structure
      setRoll(data.students.map(s => ({student_id: s.id, roll_state: 'unmark'})))
    }
  }, [data])

  const onToolbarAction = (action: ToolbarAction) => {
    // On sort, cycle through sort type and order
    if (action === "sort") {
      setSortDirectionDescending(!sortDirectionDescending)

      // For each sortBy we alternate Asc/Desc, so only cycle sortBy on desc
      if (sortDirectionDescending) {
        // Cycle sortBy
        if (sortByOptionIndex < sortByOptions.length - 1) {
          setSortByOptionIndex(sortByOptionIndex + 1)
        } else {
          setSortByOptionIndex(0)
        }
      }
    }

    if (action === "roll") {
      setIsRollMode(true)
    }
  }

  const onRollStateChange = (studentId: number, rollState: RolllStateType) => {
    let updateRoll: RollEntry[] = [...roll]
    const entry: RollEntry = {student_id: studentId, roll_state: rollState}
    const studentIndex = updateRoll.findIndex(x => x.student_id === studentId)

    // Replace student roll entry
    updateRoll.splice(studentIndex, 1, entry)

    setRoll(updateRoll)
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} sortOrderTitle={getSortByTitle(sortBy, sortDirectionDescending)} onSearchChange={setSearchTerm}/>

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && data?.students && (
          <>
            {sortStudents(searchStudents(data.students, searchTerm), sortBy, sortDirectionDescending).map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} onRollStateChange={onRollStateChange}/>
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay
        isActive={isRollMode}
        onItemClick={onActiveRollAction}
        stateList={studentRollsToRollStateList(roll)}
      />
    </>
  )
}

const sortStudents = (students: Person[], by: string, descending: boolean) => {
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

const searchStudents = (students: Person[], searchTerm: string) => {
  return students.filter(s => {
    let name = (s.first_name + ' ' + s.last_name).toLowerCase()
    searchTerm = searchTerm.toLowerCase()

    return name.indexOf(searchTerm) > -1
  })
}

const getSortByTitle = (by: string, descending: boolean) => {
  let title
  switch(by){
    case 'lastName':
      title = 'Last'
      break
    default:
      title = 'First'
  }
  title += ' Name '
  title += descending ? '▼' : '▲'

  return title
}

const studentRollsToRollStateList = (studentRolls: RollEntry[]): StateList[] => {
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

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  sortOrderTitle: string
  onSearchChange: (value: string) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, sortOrderTitle, onSearchChange } = props
  return (
    <S.ToolbarContainer>
      <S.Button onClick={() => onItemClick("sort")}>{sortOrderTitle}</S.Button>
      <div><input placeholder="Search" onChange={(e) => onSearchChange(e.target.value)}/></div>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
