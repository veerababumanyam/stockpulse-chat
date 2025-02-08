
import { Action, State } from "@/types/toast"
import { reducer } from "./reducer"

export const listeners: Array<(state: State) => void> = []

export let memoryState: State = { toasts: [] }

export function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

