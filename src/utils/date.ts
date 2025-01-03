function getDate(givenDate: Date | string | number): string  {
  const dates = new Date(givenDate.toLocaleString());
  const month = dates.getMonth() + 1;
  const year = dates.getFullYear();
  const date = dates.getDate();
  return `${month}/${date}/${year}`;
}

function getFormattedDate(date: Date): string{
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTime(date: Date): string {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
   const minutesStr = minutes < 10 ? "0" + minutes : minutes.toString();
  const strTime = hours + ":" + minutesStr + " " + ampm;
  return strTime;
}

export { getDate, getFormattedDate, formatTime };
