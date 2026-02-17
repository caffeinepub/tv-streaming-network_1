export interface YouTubeParseResult {
  success: boolean;
  videoId?: string;
  error?: string;
}

export function parseYouTubeUrl(url: string): YouTubeParseResult {
  if (!url || typeof url !== 'string') {
    return { success: false, error: 'Please enter a valid URL' };
  }

  const trimmedUrl = url.trim();

  // Pattern 1: https://www.youtube.com/watch?v=VIDEO_ID
  const watchPattern = /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/;
  const watchMatch = trimmedUrl.match(watchPattern);
  if (watchMatch && watchMatch[1]) {
    return { success: true, videoId: watchMatch[1] };
  }

  // Pattern 2: https://youtu.be/VIDEO_ID
  const shortPattern = /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const shortMatch = trimmedUrl.match(shortPattern);
  if (shortMatch && shortMatch[1]) {
    return { success: true, videoId: shortMatch[1] };
  }

  // Pattern 3: https://www.youtube.com/embed/VIDEO_ID
  const embedPattern = /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
  const embedMatch = trimmedUrl.match(embedPattern);
  if (embedMatch && embedMatch[1]) {
    return { success: true, videoId: embedMatch[1] };
  }

  return {
    success: false,
    error: 'Invalid YouTube URL. Please use a valid YouTube link (watch, youtu.be, or embed format)'
  };
}

export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'hq' | 'maxres' = 'hq'): string {
  const qualityMap = {
    default: 'default',
    hq: 'hqdefault',
    maxres: 'maxresdefault'
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}
