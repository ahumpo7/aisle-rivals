// High-performance image compression using hardware-accelerated createImageBitmap & Canvas

export async function compressImage(file, maxDimension = 1100, quality = 0.72) {
  if (!file) return null;

  // Modern browsers: hardware-accelerated createImageBitmap (off-thread decoding)
  if (typeof createImageBitmap !== 'undefined') {
    try {
      const bitmap = await createImageBitmap(file);
      let { width, height } = bitmap;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bitmap, 0, 0, width, height);
      bitmap.close();

      return await new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            canvas.width = 0;
            canvas.height = 0;
            resolve(blob || file);
          },
          'image/jpeg',
          quality
        );
      });
    } catch (err) {
      console.warn('createImageBitmap failed, falling back to Image object', err);
    }
  }

  // Fast fallback using object URLs instead of slow FileReader dataURLs
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          canvas.width = 0;
          canvas.height = 0;
          resolve(blob || file);
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file); // fallback to original file if decode fails
    };

    img.src = objectUrl;
  });
}
