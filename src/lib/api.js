import axios from "axios";

export default class Api {
  constructor() {
    this.parser = new DOMParser();
  }
  action(url) {
    return axios
      .get(`${url}?_=${Date.now()}`, {
        headers: {
          "x-requested-with": "XMLHttpRequest"
        }
      })
      .then(response => {
        return this.parser.parseFromString(response.data, "text/html");
      });
  }
  interaction(url, body) {
    const params = new URLSearchParams();
    for (let key in body) {
      params.append(key, body[key]);
    }

    return axios
      .post(url, params, {
        headers: {
          "x-requested-with": "XMLHttpRequest"
        }
      })
      .then(response => {
        return response.data;
      });
  }
  search(query) {
    return axios
      .get("autocomplete/query", {
        params: {
          q: query,
          _: Date.now()
        },
        headers: {
          "x-requested-with": "XMLHttpRequest"
        }
      })
      .then(response => {
        return response.data;
      });
  }
}
