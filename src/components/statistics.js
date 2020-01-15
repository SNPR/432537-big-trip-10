import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import chartjsPluginDatalabes from "chartjs-plugin-datalabels";
import moment from "moment";

const LegendName = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME: `TIME`
};

const LabelPrefix = {
  EURO: `€`,
  TIMES: `x`,
  HOURS: `h`
};

const generateChartData = (legendName, points) => {
  const labels = [...new Set(points.map((point) => point.type))];
  switch (legendName) {
    case LegendName.MONEY:
      return labels
        .map((label) => ({
          label,
          value: points
            .filter((point) => point.type === label)
            .reduce((acc, curr) => acc + Number(curr.price), 0)
        }))
        .sort((a, b) => b.value - a.value);

    case LegendName.TRANSPORT:
      const transportLabels = [
        `taxi`,
        `bus`,
        `train`,
        `ship`,
        `transport`,
        `drive`
      ];
      return transportLabels
        .map((label) => ({
          label,
          value: points.filter((point) => point.type === label).length
        }))
        .sort((a, b) => b.value - a.value);

    case LegendName.TIME:
      return labels
        .map((label) => ({
          label,
          value: points
            .filter((point) => point.type === label)
            .reduce(
                (acc, curr) =>
                  acc +
                Math.round(
                    moment
                    .duration(curr.endDate - curr.startDate, `milliseconds`)
                    .asHours()
                ),
                0
            )
        }))
        .sort((a, b) => b.value - a.value);
    default:
      return [];
  }
};

const renderChart = (ctx, data, label, legend, isLabelPositonLeft = false) => {
  return new Chart(ctx, {
    type: `horizontalBar`,
    plugins: [chartjsPluginDatalabes],
    data: {
      labels: data.map((item) => item.label),
      datasets: [
        {
          label: legend.toUpperCase(),
          data: data.map((item) => item.value),
          backgroundColor: `lightgray`,
          borderColor: `gray`,
          borderWidth: 1,
          barThickness: 30,
          barPercentage: 1.0
        }
      ]
    },
    options: {
      responsive: false,
      aspectRatio: 2.2,
      legend: {
        position: `left`,
        labels: {
          fontSize: 18,
          fontStyle: `bold`
        }
      },
      tooltips: {
        mode: `nearest`,
        titleAlign: `left`
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              display: false
            }
          }
        ]
      },
      plugins: {
        datalabels: {
          labels: {
            title: {
              font: {
                weight: `bold`,
                size: 16
              }
            }
          },
          anchor: `end`,
          align: `left`,
          formatter(value) {
            return isLabelPositonLeft ? `${label}${value}` : `${value}${label}`;
          }
        }
      }
    }
  });
};

export default class Statistics extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();

    this._pointsModel = pointsModel;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return `<section class="statistics">
              <h2 class="visually-hidden">Trip statistics</h2>

              <div class="statistics__item statistics__item--money">
                <canvas
                  class="statistics__chart  statistics__chart--money"
                  width="900"
                ></canvas>
              </div>

              <div class="statistics__item statistics__item--transport">
                <canvas
                  class="statistics__chart  statistics__chart--transport"
                  width="900"
                ></canvas>
              </div>

              <div class="statistics__item statistics__item--time-spend">
                <canvas
                  class="statistics__chart  statistics__chart--time"
                  width="900"
                ></canvas>
              </div>
          </section>
    `;
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    const points = this._pointsModel.getPoints();

    this._moneyChart = renderChart(
        moneyCtx,
        generateChartData(LegendName.MONEY, points),
        LabelPrefix.EURO,
        LegendName.MONEY,
        true
    );
    this._transportChart = renderChart(
        transportCtx,
        generateChartData(LegendName.TRANSPORT, points),
        LabelPrefix.TIMES,
        LegendName.TRANSPORT
    );
    this._timeChart = renderChart(
        timeCtx,
        generateChartData(LegendName.TIME, points),
        LabelPrefix.HOURS,
        LegendName.TIME
    );
  }

  rerender() {
    super.rerender();
    this._renderCharts();
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._colorsChart) {
      this._colorsChart.destroy();
      this._colorsChart = null;
    }
  }

  show() {
    super.show();

    this.rerender();
  }

  recoveryListeners() {}
}
