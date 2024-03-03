export const isSpotify = (url: string) => {
  if (url.startsWith('spotify:')) return true;

  let urlObj;

  try {
    urlObj = new URL(url);
  } catch (_) {
    return false;
  }

  const protocols = ['http:', 'https:'];
  const hosts = ['open.spotify.com', 'play.spotify.com', 'embed.spotify.com'];

  return protocols.includes(urlObj.protocol) && hosts.includes(urlObj.hostname);
};
