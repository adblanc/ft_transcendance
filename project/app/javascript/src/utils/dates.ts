import moment from "moment";

export const formatMessageDate = (date: string) => {
  const isToday =
    moment(date).format("DD/MM/YYYY") === moment().format("DD/MM/YYYY");

  return isToday
    ? moment(date).format("LT")
    : moment(date).format("DD/MM/YYYY LT");
};
