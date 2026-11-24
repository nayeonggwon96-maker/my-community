/**
 * 날짜를 YYYY.MM.DD 형식으로 변환한다
 * @param {string} value - ISO 날짜 문자열
 * @param {boolean} hasTime - 시간 포함 여부
 * @returns {string} 변환된 날짜 문자열
 */
export function formatDate(value, hasTime = false) {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  const pad = (num) => String(num).padStart(2, '0');
  const ymd = `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
  if (!hasTime) {
    return ymd;
  }
  return `${ymd} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
