import isSameMonth from 'date-fns/isSameMonth';
import format from 'date-fns/format';

export const createTripInfoTemplate = ({points, dateStart, dateEnd, cost}) => {
  return `
  <div class="trip-info__main">
    <h1 class="trip-info__title">
      ${points.start} &mdash; ${points.middle ? points.middle : `...`} &mdash; ${points.end}
    </h1>
    <p class="trip-info__dates">${formatDuration(dateStart, dateEnd)}</p>
  </div>
  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
  </p>`.trim();
};

function formatDuration(start, end) {
  if (isSameMonth(start, end)) {
    return `${format(start, `MMM dd`)} &mdash; ${format(end, `dd`)}`;
  } else {
    return `${format(start, `dd MMM`)} &mdash; ${format(end, `dd MMM`)}`;
  }
}
