import {Method} from "./models/method";
import EventAdapter from "./adapters/event.adapter";

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;

class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getEvents() {
    return this._load({
      url: `points`,
    })
    .then(toJSON)
    .then(EventAdapter.parseEvents);
  }

  createEvent({task}) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(task),
      headers: new Headers({'Content-Type': `application/json`}),
    })
    .then(toJSON)
    .then(EventAdapter.parseEvent);
  }

  updateEvent({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`}),
    })
    .then(toJSON)
    .then(EventAdapter.parseEvent);
  }

  deleteEvent({id}) {
    return this._load({
      url: `points/${id}`,
      method: Method.DELETE,
    });
  }

  getOptions() {
    return this._load({
      url: `offers`,
      method: Method.GET,
    })
    .then(toJSON);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
    .then(checkStatus)
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(`fetch error: ${err}`);
      throw err;
    });
  }
}

const api = new API({authorization: AUTHORIZATION, endPoint: END_POINT});
Object.freeze(api);
export default api;

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
