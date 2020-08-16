export default {
  getDurationFromNow(date) {
    const nextDate = new Date(date);
    const now = new Date();
    const diffInMs = substract(nextDate, now);
    const diffInMinutes = getMinutesDuration(diffInMs);
    if (diffInMinutes < 60) {
      return `${floor(diffInMinutes)} min`;
    }
    const diffInHours = getHoursFromMinute(diffInMinutes);
    return `${floor(diffInHours)} hours`;
  }
}

const substract = (a,b) => {
  return a - b;
}

const getMinutesDuration = (duration) => {
  return duration / (1000 * 60)
}

const floor = (number) => {
  return Math.floor(number);
}

const getHoursFromMinute = (minutes) => {
  return minutes / 60;
}
