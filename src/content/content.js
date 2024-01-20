import Signal from "./../lib/signal";
import Header from "./header/module";
import Section from "./section/module";
import Sidebar from "./sidebar/module";
import './content.scss';

chrome.storage.sync.get(["status"], function (result) {
  if (result.status) {

    const signal = new Signal();
    // app
    const app = document.createElement("div");
    app.setAttribute("id", "eksi-app");

    // header
    const $headerEl = document.createElement("header");
    new Header($headerEl, signal);
    signal.trigger("render:header");
    app.appendChild($headerEl);

    // main wrapper
    const main = document.createElement("main");

    // section
    const $sectionEl = document.createElement("section");
    new Section($sectionEl, signal);
    signal.trigger("render:section", document);
    main.appendChild($sectionEl);

    // aside
    const $asideEl = document.createElement("aside");
    new Sidebar($asideEl, signal);
    signal.trigger("render:sidebar", document);
    main.appendChild($asideEl);

    // main to app
    app.appendChild(main);

    // remove css files
    document.querySelectorAll("link").forEach((link) => {
      const href = link.getAttribute("href");
      if (
        href &&
        (href.startsWith("//ekstat") || href.toLocaleLowerCase().startsWith("/content"))
      ) {
        link.remove();
      }
    });

    // body
    document.body.innerHTML = "";
    document.body.classList.add("extension-ready");
    document.body.appendChild(app);

  } else {
    document.body.classList.add("extension-ready");
  }
});