export function getExcelColor(colorName) {
  const colorMap = {
    red: 'FFFF0000',
    yellow: 'FFFFFF00',
    green: 'FF00B050',
    blue: 'FF0070C0',
    black: 'FF000000',
    white: 'FFFFFFFF',
    gray: 'FF808080',
    grey: 'FF808080',
  };
  const argb = colorMap[colorName?.toLowerCase()];
  if (!argb) console.warn(`⚠️ Unknown color "${colorName}", fallback to black`);
  return argb || 'FF000000';
}

export function getExcelTextColor(colorName) {
  const colorMap = {
    red: 'FFFFFF',
    yellow: '000000',
    green: 'FFFFFF',
    blue: '000000',
    black: 'FFFFFF',
    white: '000000',
    gray: '000000',
    grey: '000000',
  };
  const argb = colorMap[colorName?.toLowerCase()];
  if (!argb) console.warn(`⚠️ Unknown color "${colorName}", fallback to black`);
  return argb || 'FF000000';
}

