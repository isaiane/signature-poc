import sharp from 'sharp'

/**
 * Step 4 - Color Correlation
 * Enhances the signature by adjusting colors to improve visibility and reduce background interference.
 */
export async function applyColorCorrelation(inputBuffer: Buffer): Promise<Buffer> {
  // Apply basic contrast enhancement and slight saturation boost
  return await sharp(inputBuffer)
    .modulate({ brightness: 1.1, saturation: 1.2 })
    .normalize() // auto contrast
    .toBuffer()
}