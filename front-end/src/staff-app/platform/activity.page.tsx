import React, { useEffect } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"

export const ActivityPage: React.FC = () => {
  const [getActivities, activitiesData, activitiesLoadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })

  useEffect(() => {
    void getActivities()
  }, [getActivities])

  console.log(activitiesData)

  return <>
    <S.Container>Activity Page</S.Container>
    <h1>{ activitiesLoadState }</h1>
    
    {activitiesLoadState === "loaded" && activitiesData?.activity && (
      <>
        {activitiesData.activity.map((a) => (
          <div>{ a.entity.id }</div>
        ))}
      </>
    )}
  </>
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}
