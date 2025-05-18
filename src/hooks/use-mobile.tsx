import * as React from "react"
// This hook determines if the current viewport is mobile based on a specified breakpoint
// and provides a boolean value indicating the mobile status.
const MOBILE_BREAKPOINT = 768

// This hook uses the `window.matchMedia` API to listen for changes in the viewport size
// and updates the `isMobile` state accordingly.
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
