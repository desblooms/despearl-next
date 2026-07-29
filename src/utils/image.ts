export function getOptimizedImageUrl(url: string | undefined, width: number = 640, quality: number = 75) {
  if (!url) {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f8f9fa'/%3E%3Ctext x='100' y='100' text-anchor='middle' fill='%2394a3b8' font-size='36'%3E📦%3C/text%3E%3C/svg%3E`;
  }
  
  let targetUrl = url;
  if (!url.startsWith('http') && !url.startsWith('data:') && !url.startsWith('blob:')) {
    if (url.startsWith('/')) {
      targetUrl = `https://app.votee.in${url}`;
    } else if (url.startsWith('uploads/')) {
      targetUrl = `https://app.votee.in/${url}`;
    } else if (url.startsWith('gallery_')) {
      targetUrl = `https://app.votee.in/uploads/products/gallery/${url}`;
    } else {
      targetUrl = `https://app.votee.in/uploads/products/${url}`;
    }
  }

  if (targetUrl.startsWith('data:') || targetUrl.startsWith('blob:')) {
    return targetUrl;
  }

  // Generate Next.js optimized image url using the built-in image optimizer route
  return `/_next/image?url=${encodeURIComponent(targetUrl)}&w=${width}&q=${quality}`;
}
