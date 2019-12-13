import moment from "moment";

export const parseTime = (UTCTimestamp) => moment(UTCTimestamp).format(`hh:mm`);

export const getDuration = (startDateUTCTimestamp, endDateUTCTimestamp) => {
  const startDate = new Date(startDateUTCTimestamp);

  const monthName = startDate.toLocaleString(`en-US`, {
    month: `short`
  });
  const startDay = startDate.getDate();
  const endDay = new Date(endDateUTCTimestamp).getDate();

  return `${monthName} ${startDay}&nbsp;&mdash;&nbsp;${endDay}`;
};
