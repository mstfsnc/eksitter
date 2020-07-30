import Signal from "./../lib/signal";
import Header from "./header/module.js";
import Section from "./section/module.js";
import Sidebar from "./sidebar/module.js";

const signal = new Signal();

document.addEventListener("DOMContentLoaded", () => {
  // app
  const app = document.createElement("div");
  app.setAttribute("id", "eksi-app");

  // header
  const $headerEl = document.createElement("header");
  const header = new Header($headerEl, signal);
  signal.trigger("render:header");
  app.appendChild($headerEl);

  // main wrapper
  const main = document.createElement("main");

  // section
  const $sectionEl = document.createElement("section");
  const section = new Section($sectionEl, signal);
  signal.trigger("render:section", document);
  main.appendChild($sectionEl);

  // aside
  const $asideEl = document.createElement("aside");
  const sidebar = new Sidebar($asideEl, signal);
  signal.trigger("render:sidebar", document);
  main.appendChild($asideEl);

  // main to app
  app.appendChild(main);

  // remove css files
  document.querySelectorAll("link").forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href &&
      (href.startsWith("//ekstat") || href.startsWith("/content/css"))
    ) {
      link.remove();
    }
  });

  // body
  document.body.innerHTML = "";
  document.body.classList.add("extension-ready");
  document.body.appendChild(app);
});
