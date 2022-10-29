import { RefObject, useEffect, useRef } from 'react'

export function useEventListener<K extends keyof WindowEventMap>(
  eventType: K,
  callback: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions,
): void
export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement,
>(
  eventType: K,
  callback: (event: HTMLElementEventMap[K]) => void,
  element: RefObject<T>,
  options?: boolean | AddEventListenerOptions,
): void
export function useEventListener<K extends keyof DocumentEventMap>(
  eventType: K,
  callback: (event: DocumentEventMap[K]) => void,
  element?: RefObject<Document>,
  options?: boolean | AddEventListenerOptions,
): void

export default function useEventListener<
  WinK extends keyof WindowEventMap,
  ElK extends keyof HTMLElementEventMap,
  T extends HTMLElement | void = void,
>(
  eventType: WinK | ElK,
  callback: (
    e: WindowEventMap[WinK] | HTMLElementEventMap[ElK] | Event,
  ) => void,
  element?: RefObject<T>,
  options?: boolean | AddEventListenerOptions,
) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const node: T | Window = element?.current || window
    if (node == null || node.addEventListener == null) return

    const handler: typeof callback = (e) => callbackRef.current(e)

    node.addEventListener(eventType, handler, options)

    return () => node.removeEventListener(eventType, handler)
  }, [eventType, element, options])
}
