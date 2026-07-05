export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function truncateText(text: string, maxUnits: number): string {
  let units = 0;
  let output = "";

  for (const char of text) {
    units += char.charCodeAt(0) > 255 ? 1.6 : 1;

    if (units > maxUnits) {
      return `${output.trimEnd()}...`;
    }

    output += char;
  }

  return output;
}

export function joinArtists(artists: string[]): string {
  return artists.filter(Boolean).join(", ");
}
