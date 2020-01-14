import moment from "moment";

const addZero = (value) => (value < 10 ? `0${value}` : value);

export const parseTime = (UTCTimestamp) => moment(UTCTimestamp).format(`HH:mm`);

export const getTripDuration = (startDateUTCTimestamp, endDateUTCTimestamp) => {
  const startMonthName = moment(startDateUTCTimestamp).format(`MMM`);
  const endMonthName = moment(endDateUTCTimestamp).format(`MMM`);
  const startDay = moment(startDateUTCTimestamp).format(`DD`);
  const endDay = moment(endDateUTCTimestamp).format(`DD`);

  return `${startMonthName} ${startDay}&nbsp;&mdash;&nbsp;${
    startMonthName !== endMonthName ? endMonthName + ` ` : ``
  }${endDay}`;
};

export const getEventDuration = (
    startDateUTCTimestamp,
    endDateUTCTimestamp
) => {
  const duration = moment
    .duration()
    .subtract(startDateUTCTimestamp - endDateUTCTimestamp);

  const days = duration.days();
  const hours = duration.hours();
  const minuntes = duration.minutes();

  return `
    ${(days > 0 && addZero(days) + `D`) || ``}
    ${((days > 0 || hours > 0) && addZero(hours) + `H`) || ``}
    ${addZero(minuntes)}M
  `;
};
