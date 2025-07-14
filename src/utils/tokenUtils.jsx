export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

export function isSpotifyTokenExpired() {
  const expiresAt = getCookie("spotify_expires_at");
  if (!expiresAt) return true;

  const now = Date.now();
  return now >= parseInt(expiresAt, 10);
}