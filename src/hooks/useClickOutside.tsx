import useEventListener from './useEventListener'
import type { RefObject } from 'react'

type UserEvents = 'mousedown' | 'mouseup' | 'touchstart' | 'touchend'

export default function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: (e: Event) => void,
  eventType: UserEvents = 'mousedown',
) {
  useEventListener(eventType, (event) => {
    if (ref.current == null || ref.current.contains(event.target as T)) return
    callback(event)
  })
}
