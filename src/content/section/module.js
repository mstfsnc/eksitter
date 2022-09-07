import Api from "../../lib/api";
import Mustache from "mustache";
import template from "./template.html";
import moment from "moment";
import "moment/locale/tr";

export default class Section {
  constructor(element, signal) {
    this.$el = element;
    this.api = new Api();

    signal.add("render:section", (model) => {
      this.model = model;
      this.render();
    });
  }

  parse() {
    const titleList = this.model.querySelectorAll(
      "#content-body #topic #title"
    );
    const entryList = this.model.querySelectorAll(
      "#content-body #topic #entry-item-list"
    );
    const filter = this.model.querySelector(
      "#content-body #topic .sub-title-container"
    );
    const showAll = this.model.querySelectorAll(
      "#content-body #topic .showall"
    );

    const sections = [];
    titleList.forEach((el, index) => {
      const list = {
        title: el.innerText,
        link: el.querySelector("a").getAttribute("href"),
        entries: [],
        modes: [],
        pagination: [],
        more: {
          top: false,
          bottom: false,
        },
        filter: false,
      };

      if (filter) {
        const modeList = filter.querySelectorAll(".nice-mode-toggler a");
        const modes = [];
        modeList.forEach((el) => {
          modes.push({
            name: el.innerText,
            link: el.getAttribute("href"),
            class: el.classList.contains("nice-on") ? "active" : "",
          });
        });
        list.modes = modes;

        const pager = filter.querySelector(".pager");
        const pagination = [];
        if (pager) {
          const current = parseInt(pager.getAttribute("data-currentpage"));
          const count = parseInt(pager.getAttribute("data-pagecount"));

          for (var i = 1; i <= count; i++) {
            pagination.push({
              value: i,
              selected: i === current ? 'selected="selected"' : "",
            });
          }
        }
        list.pagination = pagination;
        list.filter = true;
      }

      if (showAll.length) {
        const showList = Array.prototype.slice.call(showAll);
        const top = showList.shift();
        const bottom = showList.shift();

        if (top) {
          list.more.top = {
            name: top.innerText,
            link: top.getAttribute("href"),
          };
        }
        if (bottom) {
          list.more.bottom = {
            name: bottom.innerText,
            link: bottom.getAttribute("href"),
          };
        }
        list.filter = true;
      }

      if (entryList[index]) {
        const entries = entryList[index].querySelectorAll("li");
        entries.forEach((entry) => {
          const content = entry.querySelector(".content");
          if (!content) {
            return;
          }
          const date = entry.querySelector(".entry-date");
          const author = entry.querySelector(".entry-author");
          const favorite = entry.getAttribute("data-favorite-count");

          const [created, updated] = date.innerText.split("~");
          const createdAt = moment(created, "DD.MM.YYYY HH:mm").format(
            "D MMM YYYY, HH:mm"
          );
          let updatedAt = "";
          if (updated) {
            const _updated = updated.trim();
            if (_updated.length < 6) {
              updatedAt = _updated;
            } else {
              updatedAt = moment(_updated, "DD.MM.YYYY HH:mm").format(
                "D MMM YYYY, HH:mm"
              );
            }
          }

          list.entries.push({
            id: entry.getAttribute("data-id"),
            content: content.innerHTML,
            link: date.getAttribute("href"),
            date: createdAt + (updatedAt ? " ~ " + updatedAt : ""),
            favorite: favorite,
            author: {
              id: entry.getAttribute("data-author-id"),
              name: author.innerText,
              photo: author.innerText.substring(0, 1),
              link: author.getAttribute("href"),
            },
          });
        });
      }
      sections.push(list);
    });

    return sections;
  }

  listen() {
    const paginations = this.$el.querySelectorAll(".pagination select");
    if (paginations.length) {
      paginations.forEach((pagination) => {
        pagination.addEventListener("change", (event) => {
          const url = new URLSearchParams(window.location.search);
          url.set("p", event.target.value);
          url.delete("focusto");
          window.location.replace(`${location.pathname}?${url}`);
        });
      });
    }

    const interactions = this.$el.querySelectorAll("[data-interaction]");
    if (interactions.length) {
      interactions.forEach((el) => {
        el.addEventListener("click", (event) => {
          event.preventDefault();
          const type = el.getAttribute("data-interaction");
          const id = el.getAttribute("data-id");
          const authorId = el.getAttribute("data-author");
          const url = el.getAttribute("data-url");

          switch (type) {
            case "like":
              this.api
                .interaction(url, { id: id, owner: authorId, rate: 1 })
                .then((response) => {
                  if (response) {
                    if (url === "/entry/vote") {
                      el.classList.add("voted");
                      el.setAttribute("data-url", "/entry/removevote");
                    } else {
                      el.classList.remove("voted");
                      el.setAttribute("data-url", "/entry/vote");
                    }
                  }
                });
              break;
            case "dislike":
              this.api
                .interaction(url, {
                  id: id,
                  owner: authorId,
                  rate: -1,
                })
                .then((response) => {
                  if (response) {
                    if (url === "/entry/vote") {
                      el.classList.add("voted");
                      el.setAttribute("data-url", "/entry/removevote");
                    } else {
                      el.classList.remove("voted");
                      el.setAttribute("data-url", "/entry/vote");
                    }
                  }
                });
              break;
            case "favorite":
              this.api
                .interaction(url, {
                  entryId: id,
                })
                .then((response) => {
                  if (response) {
                    if (url === "/entry/favla") {
                      el.classList.add("voted");
                      el.setAttribute("data-url", "/entry/favlama");
                    } else {
                      el.classList.remove("voted");
                      el.setAttribute("data-url", "/entry/favla");
                    }
                    el.querySelector(".count").innerText = response.Count;
                  }
                });
              break;
          }
        });
      });
    }
  }

  render() {
    this.$el.insertAdjacentHTML(
      "beforeend",
      Mustache.render(template, {
        sections: this.parse(),
      })
    );
    this.listen();
  }
}
