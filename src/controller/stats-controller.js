import Stats from "../components/stats";
import {render, unrender} from "../util/dom";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

export default class StatsController {
  constructor(container) {
    this._container = container;
    this._statsComponent = new Stats();
  }

  init() {
    render(this._statsComponent.getElement(), this._container);
    // this._initMoneyChart();
  }

  destroy() {
    unrender(this._statsComponent.getElement());
    this._statsComponent.removeElement();
  }

  _initMoneyChart() {
    const moneyChart = this._initChart({
      selector: `.statistics__chart--money`, options: {
        plugins: [ChartDataLabels],
        type: `bar`,
        data: [10, 20, 30],
        options: {},
      },
    });
  }

  _initTransportChart() {
    // const container = this._statsComponent.getElement().querySelector(`.`);
  }

  _initTimeChart() {
    // const container = this._statsComponent.getElement().querySelector(`.`);
  }

  _initChart({selector, options}) {
    const container = this._statsComponent.getElement().querySelector(selector);
    return new Chart(container, options);
  }
}
