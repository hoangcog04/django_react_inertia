"use client"

import { useCallback, useEffect, useRef } from "react"

export function useIsMounted(): () => boolean {
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  // return a func that returns the newest value of isMounted
  return useCallback(() => isMounted.current, [])
}
