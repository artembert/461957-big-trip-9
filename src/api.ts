import { Method } from "./models/method";
import EventAdapter from "./adapters/event.adapter";
import { Point } from "./types/point";
import { PointJSON } from "./types/point-json";

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;

class API {
  private readonly _endPoint: string;
  private readonly _authorization: string;

  constructor({ endPoint, authorization }: { endPoint: string; authorization: string }) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  public getEvents(): Promise<Point[]> {
    return this._load({
      url: `points`,
    })
      .then(toJSON)
      .then(EventAdapter.parseEvents);
  }

  public createEvent({ task }) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(task),
      headers: new Headers({ "Content-Type": `application/json` }),
    })
      .then(toJSON)
      .then(EventAdapter.parseEvent);
  }

  public updateEvent({ id, data }) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({ "Content-Type": `application/json` }),
    })
      .then(toJSON)
      .then(EventAdapter.parseEvent);
  }

  public deleteEvent({ id }: { id: string }): Promise<Response | Error> {
    return this._load({
      url: `points/${id}`,
      method: Method.DELETE,
    });
  }

  public getOptions() {
    return this._load({
      url: `offers`,
      method: Method.GET,
    }).then(toJSON);
  }

  private _load({ url, method = Method.GET, body = null, headers = new Headers() }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, { method, body, headers })
      .then(checkStatus)
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(`fetch error: ${err}`);
        throw err;
      });
  }
}

const api = new API({ authorization: AUTHORIZATION, endPoint: END_POINT });
Object.freeze(api);
export default api;

function checkStatus(response: Response): Response | Error {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
}

function toJSON(response: Response): Promise<PointJSON | PointJSON[]> {
  return response.json();
}
