
import * as React from "react"
import { createToast } from "./toast/utils"
import { listeners, memoryState } from "./toast/store"
import { State } from "@/types/toast"
import { dispatch } from "./toast/store"

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast: createToast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, createToast as toast }

