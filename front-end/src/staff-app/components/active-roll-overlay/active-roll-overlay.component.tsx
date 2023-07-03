import React from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { ItemType, RollStateList, StateList } from "staff-app/components/roll-state/roll-state-list.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Colors } from "shared/styles/colors"
import { LoadState } from "shared/hooks/use-api"

export type ActiveRollAction = "filter" | "exit" | "complete"
interface Props {
  isActive: boolean
  onItemClick: (action: ActiveRollAction, value?: string) => void
  stateList: StateList[]
  onRollStateClick?: (type: ItemType) => void 
  activeState?: ItemType
  loadState: LoadState
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const { isActive, onItemClick, stateList, onRollStateClick, activeState, loadState } = props

  const handleRollStateClick = (type: ItemType) => {
    if (onRollStateClick) {
      onRollStateClick(type)
    }
  }

  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div>Class Attendance</div>
        <div>
          <RollStateList
            stateList={stateList}
            onItemClick={handleRollStateClick}
            activeState={activeState}
          />
          <S.Details hasError={loadState === 'error'}>
            {loadState === 'loading' && (
              <FontAwesomeIcon icon="spinner" size="2x" color="white" spin />
            )}
            {(loadState === 'loaded' || loadState === 'error') && (
                <>
                  {loadState === 'error' && 
                    <S.Error>Failed to save</S.Error>
                  }
                  <Button color="inherit" onClick={() => onItemClick("exit")}>
                    Exit
                  </Button>
                  <Button color="inherit" style={{ marginLeft: Spacing.u2 }} onClick={() => onItemClick("complete")}>
                    { loadState === 'loaded' ? 'Complete' : 'Retry'}
                  </Button>
                </>
            )}
          </S.Details>
        </div>
      </S.Content>
    </S.Overlay>
  )
}

const S = {
  Overlay: styled.div<{ isActive: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    height: ${({ isActive }) => (isActive ? "120px" : 0)};
    width: 100%;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  Content: styled.div`
    display: flex;
    justify-content: space-between;
    width: 52%;
    height: 100px;
    margin: ${Spacing.u3} auto 0;
    border: 1px solid #f5f5f536;
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u4};
  `,
  Details: styled.div<{ hasError: boolean }>`
    margin-top: ${({ hasError }) => (hasError ? Spacing.u2 : Spacing.u6)};
  `,
  Error: styled.div`
    color: ${Colors.error.base};
  `,
}
