import Jimp from 'jimp';

export async function removeBackground(imageBuffer: Buffer): Promise<Buffer> {
  const image = await Jimp.read(imageBuffer);
  image.rgba(true);
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const red = this.bitmap.data[idx + 0];
    const green = this.bitmap.data[idx + 1];
    const blue = this.bitmap.data[idx + 2];
    // Consider white or almost white pixels
    if (red > 225 && green > 225 && blue > 225) {
      this.bitmap.data[idx + 3] = 0; // Set alpha channel to 0 (transparent)
    }
  });
  return await image.getBufferAsync(Jimp.MIME_PNG);
}
