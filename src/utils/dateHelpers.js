
// Format ke "2025-07-15"
export function getWITDateString() {
  const witTime = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jayapura',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  const [day, month, year] = witTime.split('/');
  return `${year}-${month}-${day}`;
}

// Format ke "15 Juli 2025"
export function getWITDateLong() {
  const witTime = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jayapura',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }).format(new Date());

  return witTime;
}

// Format ke "2025-07-15 13:45:21"
export function getWITDateTimeString() {
  const witTime = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jayapura',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());

  const [date, time] = witTime.split(', ');
  const [day, month, year] = date.split('/');
  const formattedTime = time.replace(/\./g, ':');

  return `${year}-${month}-${day} ${formattedTime}`;
}
