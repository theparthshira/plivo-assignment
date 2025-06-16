export const formatDate = (_date: string) => {
  const date = new Date(_date);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);

  return formattedDate;
};
