import React from "react"
import styled from "styled-components"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { Activity } from "shared/models/activity"
import { RollStateList } from "../roll-state/roll-state-list.component"
import { studentRollsToRollStateList } from "shared/helpers/data-utils"

interface Props {
  activity: Activity
}
export const ActivityListTile: React.FC<Props> = ({ activity }) => {
  const date = new Date(activity.date).toLocaleDateString()

  return (
    <S.Container>
      <S.Content>
        <div>{ activity.entity.name }</div>
        <div>{ date }</div>
        <RollStateList stateList={studentRollsToRollStateList(activity.entity.student_roll_states)} />
      </S.Content>
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    margin-top: ${Spacing.u3};
    padding-right: ${Spacing.u2};
    display: flex;
    height: 60px;
    border-radius: ${BorderRadius.default};
    background-color: #fff;
    box-shadow: 0 2px 7px rgba(5, 66, 145, 0.13);
    transition: box-shadow 0.3s ease-in-out;

    &:hover {
      box-shadow: 0 2px 7px rgba(5, 66, 145, 0.26);
    }
  `,
  Content: styled.div`
    flex-grow: 1;
    padding: ${Spacing.u2};
    color: ${Colors.dark.base};
    font-weight: ${FontWeight.strong};
  `,
}
