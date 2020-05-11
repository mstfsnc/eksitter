export default class Signal {
  constructor() {
    this.events = {};
  }

  add(name, callback) {
    this.events[name] = callback;
  }

  trigger(name, data) {
    this.events[name](data);
  }
}
