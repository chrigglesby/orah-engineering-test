import React, { useEffect } from "react"
import styled from "styled-components"
import { BorderRadius, FontWeight, Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ActivityListTile } from "staff-app/components/activity/activity-list-tile.component"
import { Colors } from "shared/styles/colors"

export const ActivityPage: React.FC = () => {
  const [getActivities, activitiesData, activitiesLoadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })

  useEffect(() => {
    void getActivities()
  }, [getActivities])

  return <>
    <S.Container>
      <S.ToolbarContainer>Activity Page</S.ToolbarContainer>
      
      {activitiesLoadState === "loading" && (
        <CenteredContainer>
          <FontAwesomeIcon icon="spinner" size="2x" spin />
        </CenteredContainer>
      )}
      
      {activitiesLoadState === "loaded" && activitiesData?.activity && (
        <>
          {activitiesData.activity.map((a) => (
            <ActivityListTile activity={a}/>
          ))}
        </>
      )}
    </S.Container>
  </>
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
}
