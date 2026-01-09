import { v4 as uuidv4 } from 'uuid'

export function getOrCreateDeviceId() {
  // Verificar se está no cliente antes de usar localStorage
  if (typeof window === 'undefined') {
    return null
  }
  
  let deviceId = localStorage.getItem('deviceId')
  if (!deviceId) {
    deviceId = uuidv4()
    localStorage.setItem('deviceId', deviceId)
    console.log('[fingerprint] new ID generated:', deviceId)
  }
  return deviceId
}