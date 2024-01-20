import Api from "../../lib/api";
import Mustache from "mustache";
import template from "./template.html?raw";

export default class Header {
  constructor(element, signal) {
    this.$el = element;
    this.api = new Api();
    this.signal = signal;

    signal.add("render:header", this.render.bind(this));
  }
  listen() {
    const links = this.$el.querySelectorAll("[data-action]");
    links.forEach((el) => {
      el.addEventListener("click", (event) => {
        event.preventDefault();
        const element = event.target.closest("a");
        const action = element.getAttribute("data-action");

        this.api.action(action).then((model) => {
          this.signal.trigger("render:sidebar", model);
        });
      });
    });
  }
  render() {
    this.$el.insertAdjacentHTML("beforeend", Mustache.render(template));
    this.listen();
  }
}
