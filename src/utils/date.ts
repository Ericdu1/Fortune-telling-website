/**
 * 格式化日期为 YYYY/MM/DD 格式
 * @param date 日期对象，默认为当前日期
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
}; 