import isSameMonth from 'date-fns/isSameMonth';
import format from 'date-fns/format';

export const createTripInfoTemplate = ({pointStart, pointEnd, dateStart, dateEnd}) => {
  return `<div class="trip-info__main">
              <h1 class="trip-info__title">${pointStart} &mdash; ... &mdash; ${pointEnd}</h1>

              <p class="trip-info__dates">${formatDuration(dateStart, dateEnd)}</p>
            </div>`;
};

function formatDuration(start, end) {
  if (isSameMonth(start, end)) {
    return `${format(start, `MMM dd`)} &mdash; ${format(end, `dd`)}`;
  } else {
    return `${format(start, `MMM dd`)} &mdash; ${format(end, `MMM dd`)}`;
  }
}
