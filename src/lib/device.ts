import { v4 as uuidv4 } from 'uuid'

export function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem('deviceId')
  if (!deviceId) {
    deviceId = uuidv4()
    localStorage.setItem('deviceId', deviceId)
    console.log('[fingerprint] new ID generated:', deviceId)
  }
  return deviceId
}