let timer;
const pressDuration = 1000; // Duration in milliseconds to consider as a long press

export function start() {
  // Start the timer
  timer = setTimeout(() => {
    console.log("Long press detected!");
    // Trigger your long press logic here
  }, pressDuration);
}

export function cancel() {
  // Stop the timer if it hasn't finished yet
  clearTimeout(timer);
}