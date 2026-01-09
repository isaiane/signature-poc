'use client'

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

export interface OverlayGuideHandle {
  getRect: () => DOMRect | null
}

const OverlayGuide = forwardRef<OverlayGuideHandle>((_, ref) => {
  const [isPortrait, setIsPortrait] = useState(true)
  const frameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useImperativeHandle(ref, () => ({
    getRect: () => {
      return frameRef.current?.getBoundingClientRect() ?? null
    },
  }))

  const aspectRatio = isPortrait ? 7 / 4 : 39 / 10

  return (
    <div className="relative inset-0 z-20 flex items-center justify-center pointer-events-none w-full h-full">
      <div
        ref={frameRef}
        className="z-20 w-full h-auto max-w-[90%] max-h-[90%]"
        style={{
          aspectRatio: `${aspectRatio}`,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
          borderRadius: '8px',
        }}
      />
    </div>
  )
})

OverlayGuide.displayName = 'OverlayGuide'

export default OverlayGuide