import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { BorderRadius, FontWeight, Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ActivityListTile } from "staff-app/components/activity/activity-list-tile.component"
import { Colors } from "shared/styles/colors"
import { Person } from "shared/models/person"
import Button from "@material-ui/core/ButtonBase"
import { sortAlphabetical, sortDate } from "shared/helpers/sort-utils"

export const ActivityPage: React.FC = () => {
  const [getActivities, activitiesData, activitiesLoadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })
  const [getStudents, studentsData, studentsLoadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [activeActivityId, setActiveActivityId] = useState<number | null>(null)
  const [sortDescending, setSortDescending] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name')

  useEffect(() => {
    void getActivities()
  }, [getActivities])

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  const toggleSort = () => {
    setSortDescending(!sortDescending)

      // For each sortBy we alternate Asc/Desc, so only cycle sortBy on desc
      if (sortDescending) {
        // Cycle sortBy
        setSortBy(sortBy === 'name' ? 'date' : 'name')
      }
  }

  const sortActivities = (input: Activity[]) => {
    return [...input].sort((a: Activity, b: Activity) => {
      if (sortBy === 'name') {
        return sortAlphabetical(a.entity.name, b.entity.name, sortDescending)
      }
      return sortDate(a.date, b.date, sortDescending)
    })
  }

  const activities = activitiesData?.activity ?
    sortActivities(activitiesData.activity)
    : undefined

  return <>
    <S.Container>
      <Toolbar sortOrderTitle={getSortByTitle(sortBy, sortDescending)} onClick={toggleSort}/>
      
      {activitiesLoadState === "loading" || studentsLoadState === "loading" && (
        <CenteredContainer>
          <FontAwesomeIcon icon="spinner" size="2x" spin />
        </CenteredContainer>
      )}
      
      {activitiesLoadState === "loaded"
        && studentsLoadState === "loaded"
        && activities
        && studentsData?.students
        && (
        <>
          {activities.map((a) => (
            <ActivityListTile
              key={a.entity.id}
              activity={a}
              students={studentsData.students}
              onClick={setActiveActivityId}
              active={activeActivityId === a.entity.id}
            />
          ))}
        </>
      )}

      {activitiesLoadState === "loaded" && activities?.length === 0 && (
        <CenteredContainer>
          <div>No activities found</div>
        </CenteredContainer>
      )}

      {(activitiesLoadState === "error" || studentsLoadState === "error") && (
        <CenteredContainer>
          <div>Failed to load</div>
        </CenteredContainer>
      )}
    </S.Container>
  </>
}

const getSortByTitle = (by: string, descending: boolean) => {
  let title
  switch(by){
    case 'date':
      title = 'Date'
      break
    default:
      title = 'Name'
  }
  title += descending ? ' ▼' : ' ▲'

  return title
}

interface ToolbarProps {
  onClick: () => void
  sortOrderTitle: string
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onClick, sortOrderTitle } = props
  return (
    <S.ToolbarContainer>
      <S.Button onClick={onClick}>{sortOrderTitle}</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
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
