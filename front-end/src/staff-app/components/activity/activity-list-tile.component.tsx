import React from "react"
import styled from "styled-components"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { Activity } from "shared/models/activity"
import { RollStateList } from "../roll-state/roll-state-list.component"
import { studentRollsToRollStateList } from "shared/helpers/data-utils"
import { RollStateIcon } from "../roll-state/roll-state-icon.component"
import { Person, PersonHelper } from "shared/models/person"

interface Props {
  activity: Activity,
  students: Person[]
}
export const ActivityListTile: React.FC<Props> = ({ activity, students }) => {
  const date = new Date(activity.date).toLocaleDateString()

  return (
    <S.Container>
      <S.Content>
        <S.Title>
          { activity.entity.name }
          <S.Info>
            - { date }
          </S.Info>
        </S.Title>
        <S.RollStateContainer>
          <RollStateList stateList={studentRollsToRollStateList(activity.entity.student_roll_states)} />
        </S.RollStateContainer>
        <S.Students>
          { activity.entity.student_roll_states.map((s) => (
            <S.Student key={s.student_id}>
              <RollStateIcon type={s.roll_state} size={10}/>
              <div>{ getStudentName(s.student_id, students) }</div>
            </S.Student>
          )) }
        </S.Students>
      </S.Content>
    </S.Container>
  )
}

const getStudentName = (student_id: number, students: Person[]): string | undefined => {
  const student: Person | undefined = students.find(s => s.id === student_id)
  
  return student ? PersonHelper.getFullName(student) : undefined
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
  Title: styled.div`
    padding-bottom: ${Spacing.u2};
  `,
  Info: styled.div`
    display: inline-block;
    margin-left: ${Spacing.u2};
    color: ${Colors.blue.darker};
    font-weight: ${FontWeight.light};
  `,
  RollStateContainer: styled.div`
    display: inline-block;
  `,
  Students: styled.div`
    
  `,
  Student: styled.div`
    display: flex;
  `,
}
