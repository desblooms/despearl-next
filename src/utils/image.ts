export function getOptimizedImageUrl(url: string | undefined, width: number = 640, quality: number = 75) {
  if (!url) {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f8f9fa'/%3E%3Ctext x='100' y='100' text-anchor='middle' fill='%2394a3b8' font-size='36'%3E📦%3C/text%3E%3C/svg%3E`;
  }

  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // Already proxied paths
  if (url.startsWith('/admin-media/') || url.startsWith('/votee-media/')) {
    return url;
  }

  // Optimize Unsplash images directly at source via Unsplash CDN parameters
  if (url.includes('images.unsplash.com')) {
    return url.replace(/w=\d+/, `w=${width}`).replace(/q=\d+/, `q=${quality}`);
  }

  // Proxy admin.despearl.com to same-origin /admin-media/ to fix iOS/WebKit TLS/cert & ITP drops
  if (url.startsWith('https://admin.despearl.com/')) {
    return url.replace('https://admin.despearl.com/', '/admin-media/');
  }
  if (url.startsWith('http://admin.despearl.com/')) {
    return url.replace('http://admin.despearl.com/', '/admin-media/');
  }

  // Proxy app.votee.in to same-origin /votee-media/
  if (url.startsWith('https://app.votee.in/')) {
    return url.replace('https://app.votee.in/', '/votee-media/');
  }
  if (url.startsWith('http://app.votee.in/')) {
    return url.replace('http://app.votee.in/', '/votee-media/');
  }

  // Relative admin paths
  if (url.startsWith('/public/images/')) {
    return `/admin-media${url}`;
  }

  // If already full external URL (e.g. other CDNs)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Relative product/ERP image paths
  if (url.startsWith('/')) {
    return `/votee-media${url}`;
  } else if (url.startsWith('uploads/')) {
    return `/votee-media/${url}`;
  } else if (url.startsWith('gallery_')) {
    return `/votee-media/uploads/products/gallery/${url}`;
  } else {
    return `/votee-media/uploads/products/${url}`;
  }
}

export function resolveVideoUrl(url: string | undefined) {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/votee-media/')) return url;
  
  if (url.startsWith('https://app.votee.in/')) {
    return url.replace('https://app.votee.in/', '/votee-media/');
  }
  if (url.startsWith('http://app.votee.in/')) {
    return url.replace('http://app.votee.in/', '/votee-media/');
  }

  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `/votee-media${url}`;
  if (url.startsWith('uploads/')) return `/votee-media/${url}`;
  return `/votee-media/uploads/reels/${url}`;
}
