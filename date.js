//jshint esversion:6

exports.getDate = () => {
  const today = new Date();
  //   let currentDay = today.getDay();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  return today.toLocaleDateString("en-US", options);
};
