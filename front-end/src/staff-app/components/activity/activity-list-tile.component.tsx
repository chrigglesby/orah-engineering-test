import React from "react"
import styled from "styled-components"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { Activity } from "shared/models/activity"
import { RollStateList } from "../roll-state/roll-state-list.component"
import { studentRollsToRollStateList } from "shared/helpers/data-utils"
import { RollStateIcon } from "../roll-state/roll-state-icon.component"
import { Person, PersonHelper } from "shared/models/person"
import { RollEntry } from "shared/models/roll"
import { sortAlphabetical } from "shared/helpers/sort-utils"

interface Props {
  activity: Activity
  students: Person[]
  onClick: (id: number | null) => void
  active?: boolean
}
export const ActivityListTile: React.FC<Props> = ({ activity, students, onClick, active }) => {
  const date = new Date(activity.date).toLocaleDateString()

  const handleClick = () => {
    onClick(!active ? activity.entity.id : null)
  }

  // First name ascending order
  const studentRollStates: StudentRollState[] = activity.entity.student_roll_states.map((s) => {
    let student: StudentRollState = {
      ...s,
      name: getStudentName(s.student_id, students) || ''
    }

    return student
  }).sort((a, b) => sortAlphabetical(a.name, b.name))

  return (
    <S.Container onClick={handleClick}>
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
        <S.Students active={active}>
          { studentRollStates.map((s) => (
            <S.Student key={s.student_id}>
              <RollStateIcon type={s.roll_state} size={14}/>
              <S.StudentName>{ s.name }</S.StudentName>
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

interface StudentRollState extends RollEntry {
  name: string
}

const S = {
  Container: styled.div`
    margin-top: ${Spacing.u3};
    padding-right: ${Spacing.u2};
    display: flex;
    min-height: 60px;
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
  Students: styled.div<{ active?: boolean; }>`
    display: block;
    max-height: ${props => props.active ? "500px" : "0px"};
    overflow: hidden;
    padding: ${Spacing.u1};
    transition: max-height 0.3s ease-in-out;
  `,
  Student: styled.div`
    display: flex;
    padding: ${Spacing.u1};
  `,
  StudentName: styled.div`
    margin-left: ${Spacing.u2};
  `,
}
