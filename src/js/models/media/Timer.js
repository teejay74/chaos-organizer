export default class Timer {
  constructor(data) {
    this.container = data;
    this.minutes = 0;
    this.seconds = 0;
    this.intervalId = null;
  }

  start() {
    this.intervalId = setInterval(() => {
      this.seconds += 1;

      if (this.seconds === 60) {
        this.minutes += 1;
        this.seconds = 0;
      }

      this.redrawTimer();
    }, 1000);
  }

  redrawTimer() {
    const minStr = this.minutes >= 10 ? `${this.minutes}` : `0${this.minutes}`;
    const secStr = this.seconds >= 10 ? `${this.seconds}` : `0${this.seconds}`;
    this.container.textContent = `${minStr}:${secStr}`;
  }

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.minutes = 0;
    this.seconds = 0;
    this.redrawTimer();
  }
}
