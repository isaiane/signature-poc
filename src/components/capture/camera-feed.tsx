'use client'

import { useEffect, useRef, forwardRef } from 'react'

interface CameraFeedProps {
  facingMode: 'user' | 'environment'
}

const CameraFeed = forwardRef<HTMLVideoElement, CameraFeedProps>(({ facingMode }, ref) => {
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    const video = (ref as React.RefObject<HTMLVideoElement>)?.current
    if (!video) return

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        })
        streamRef.current = stream
        // Attach stream to video element
        video.srcObject = stream
        // Ensure attributes
        video.playsInline = true
        video.autoplay = true
        video.muted = true
        await video.play().catch(() => {
          // play() may reject on some browsers without user gesture; ignore
        })
      } catch (err) {
        console.error('[CameraFeed] Error accessing camera:', err)
      }
    }

    startCamera()

    return () => {
      // Stop tracks when unmounting or facingMode changes
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
      const vid = (ref as React.RefObject<HTMLVideoElement>)?.current
      if (vid) {
        vid.srcObject = null
      }
    }
  }, [facingMode, ref])

  return (
    <video
      ref={ref}
      className="absolute inset-0 w-full h-full object-cover z-0"
      playsInline
      autoPlay
      muted
    />
  )
})

CameraFeed.displayName = 'CameraFeed'

export default CameraFeed