import {Method} from "./models/method";
import EventAdapter from "./adapters/event-adapter";

export const API = class {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getTasks() {
    return this._load({
      url: `tasks`,
    })
    .then(toJSON)
    .then(EventAdapter.parseEvents);
  }

  createTask({task}) {
    return this._load({
      url: `tasks`,
      method: Method.POST,
      body: JSON.stringify(task),
      headers: new Headers({'Content-Type': `application/json`}),
    })
    .then(toJSON)
    .then(EventAdapter.parseEvent);
  }

  updateTask({id, data}) {
    return this._load({
      url: `tasks/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`}),
    })
    .then(toJSON)
    .then(EventAdapter.parseEvent);
  }

  deleteTask({id}) {
    return this._load({
      url: `task/${id}`,
      method: Method.DELETE,
    });
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
    .then(checkStatus)
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(`fetch error: ${err}`);
      throw err;
    });
  }
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
}

function toJSON(response) {
  return response.json();
}
