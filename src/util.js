export default {
  getDurationFromNow(date) {
    const nextDate = new Date(date);
    const now = new Date();
    const diffInMs = substract(nextDate, now);
    const diffInMinutes = getMinutesDuration(diffInMs);
    if (diffInMinutes < 60) {
      return `${ceil(diffInMinutes)} min`;
    }
    const diffInHours = getHoursFromMinute(diffInMinutes);
    return `${ceil(diffInHours)} hours`;
  },
  getInitialExpDateWithAdditionalHours(hour = 0) {
    const date = new Date();
    if (date.getHours() + hour > 24) {
      const hours = date.getHours() + hour > 24 ? (date.getHours() + hour - 24) : (date.getHours() + hour);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1} ${hour}:${date.getMinutes()}`;
    }
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${hour}:${date.getMinutes()}`;
  }
}

const substract = (a,b) => {
  return a - b;
}

const getMinutesDuration = (duration) => {
  return duration / (1000 * 60)
}

const ceil = (number) => {
  return Math.ceil(number);
}

const getHoursFromMinute = (minutes) => {
  return minutes / 60;
}
