//jshint esversion:6

module.exports.getDate = getDate;

function getDate() {
  let today = new Date();
  //   let currentDay = today.getDay();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  return today.toLocaleDateString("en-US", options);
}
