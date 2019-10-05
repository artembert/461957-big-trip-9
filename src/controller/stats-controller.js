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
    this._setGlobalChartOptions();
    this._initMoneyChart();
  }

  destroy() {
    unrender(this._statsComponent.getElement());
    this._statsComponent.removeElement();
  }

  _initMoneyChart() {
    const moneyChart = this._initChart({
      selector: `.statistics__chart--money`, options: {
        plugins: [ChartDataLabels],
        type: `horizontalBar`,
        data: {
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [{
            data: [65, 59, 80, 81, 56, 55, 40],
            borderWidth: 1,
            backgroundColor: `#ffffff`,
          }],
        },
        options: {
          plugins: {
            datalabels: {
              anchor: `end`,
              clamp: true,
              align: `left`,
              formatter: (value) => `€ ${value}`
            },
          },
          legend: {
            display: false,
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: false,
              },
            }],
          },
        },
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

  _setGlobalChartOptions() {
    Chart.defaults.global.defaultFontFamily = `"Montserrat", "Arial", sans-serif`;
    Chart.defaults.global.defaultFontSize = 17;
    Chart.defaults.global.defaultFontStyle = `bold`;
    Chart.defaults.global.defaultFontColor = `#000`;
  }
}
