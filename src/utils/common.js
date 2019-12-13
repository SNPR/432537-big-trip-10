import moment from "moment";

export const parseTime = (UTCTimestamp) => moment(UTCTimestamp).format(`hh:mm`);

export const getTripDuration = (startDateUTCTimestamp, endDateUTCTimestamp) => {
  const monthName = moment(startDateUTCTimestamp).format(`MMM`);
  const startDay = moment(startDateUTCTimestamp).format(`DD`);
  const endDay = moment(endDateUTCTimestamp).format(`DD`);

  return `${monthName} ${startDay}&nbsp;&mdash;&nbsp;${endDay}`;
};
