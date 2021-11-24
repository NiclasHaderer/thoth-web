export const toReadableTime = (totalSeconds: number) => {
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
  let seconds = totalSeconds - (hours * 3600) - (minutes * 60);

  const hourString = hours < 10 ? `0${hours}` : hours.toString();
  const minuteString = minutes < 10 ? `0${minutes}` : minutes.toString();
  const secondString = seconds < 10 ? `0${seconds}` : seconds.toString();

  return (hourString !== '00' ? `${hourString}:` : '') + `${minuteString}:` + secondString;
};
