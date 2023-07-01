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

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [sortDirectionDescending, setSortDirectionDescending] = useState(false)
  const [sortByOptionIndex, setSortByOptionIndex] = useState(0)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })

  const sortByOptions = ['fullName', 'firstName', 'lastName']
  const sortBy = sortByOptions[sortByOptionIndex]
  
  useEffect(() => {
    void getStudents()
  }, [getStudents])

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

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} sortOrderTitle={getSortByTitle(sortBy, sortDirectionDescending)}/>

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && data?.students && (
          <>
            {sortStudents(data.students, sortBy, sortDirectionDescending).map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s}/>
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

const sortStudents = (students: Person[], by: string, descending: boolean) => {
  students.sort((a, b) => {
    let nameA = a.first_name
    let nameB = b.first_name

    if (by === 'fullName') {
      nameA += a.last_name
      nameB += b.last_name
    } else if (by === 'lastName') {
      nameA = a.last_name
      nameB = b.last_name
    }

    return sortAlphabetical(nameA, nameB, descending)
  })

  return students
}

const getSortByTitle = (by: string, descending: boolean) => {
  let title
  switch(by){
    case 'firstName':
      title = 'First'
      break
    case 'lastName':
      title = 'Last'
      break
    default:
      title = 'Full'
  }
  title += ' Name '
  title += descending ? '▼' : '▲'

  return title
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  sortOrderTitle: string
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, sortOrderTitle } = props
  return (
    <S.ToolbarContainer>
      <div onClick={() => onItemClick("sort")}>{sortOrderTitle}</div>
      <div>Search</div>
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
