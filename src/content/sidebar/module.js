import Api from "../../lib/api";
import Mustache from "mustache";
import template from "./template.html";
import search from "./search.html";

export default class Sidebar {
  constructor(element, signal) {
    this.$el = element;
    this.api = new Api();

    signal.add("render:sidebar", model => {
      this.model = model;
      this.render();
    });
  }

  parse() {
    const topicList = this.model.querySelectorAll(".topic-list.partial li a");
    const title = this.model.querySelector("h2").innerText;

    const topics = [];
    topicList.forEach(topic => {
      let title = topic.innerText.trim();
      let count = topic.querySelector("small");
      let link = topic.getAttribute("href");
      if (count) {
        count = count.innerText;
        title = title.replace(count, "");
      }

      if (title) {
        topics.push({
          link,
          title,
          count
        });
      }
    });

    return { topics, title };
  }
  listen() {
    const $result = this.$el.querySelector(".result");
    const input = this.$el.querySelector(".search input");
    let showResult = false;
    if (input) {
      input.addEventListener("keyup", event => {
        const value = event.target.value;
        if (value) {
          this.api.search(value).then(response => {
            $result.innerHTML = "";
            $result.insertAdjacentHTML(
              "beforeend",
              Mustache.render(search, {
                titles: response.Titles.map(title => ({ title })),
                users: response.Nicks.map(user => ({ user }))
              })
            );
            if (showResult === false) {
              showResult = true;
              $result.classList.add("show");
            }
          });
        } else {
          if (showResult === true) {
            showResult = false;
            $result.classList.remove("show");
          }
        }
      });

      document.body.addEventListener("click", event => {
        if (showResult === true) {
          showResult = false;
          $result.classList.remove("show");
        }
      });
    }
  }
  render() {
    this.$el.insertAdjacentHTML(
      "beforeend",
      Mustache.render(template, this.parse())
    );
    this.listen();
  }
}
