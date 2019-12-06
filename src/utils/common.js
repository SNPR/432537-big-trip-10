const addZero = (value) => {
  if (value === 0) {
    return `00`;
  } else if (value < 10) {
    return `0${value}`;
  }

  return value;
};

export const parseDate = (UTCTimestamp) => {
  const date = new Date(UTCTimestamp);
  return `${date.getDate()}/${date.getMonth()}/${String(
      date.getFullYear()
  ).slice(2)}`;
};

export const parseTime = (UTCTimestamp) => {
  const date = new Date(UTCTimestamp);
  return `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
};

export const getDuration = (startDateUTCTimestamp, endDateUTCTimestamp) => {
  const startDate = new Date(startDateUTCTimestamp);

  const monthName = startDate.toLocaleString(`en-US`, {
    month: `short`
  });
  const startDay = startDate.getDate();
  const endDay = new Date(endDateUTCTimestamp).getDate();

  return `${monthName} ${startDay}&nbsp;&mdash;&nbsp;${endDay}`;
};
