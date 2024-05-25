import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-comparison-graph',
  templateUrl: './comparison-graph.component.html',
  styleUrls: ['./comparison-graph.component.css'],
  standalone: true
})
export class ComparisonGraphComponent implements OnInit {
  public chart: any;
  @Input() chartId!: string;
  @Input() chartHeading!: string;
  @Input() dataset!: any[];
  @Input() weather!: any[];
  @Input() labels!: any[];
  @Input() showWeather!: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showWeather']) {
      if (this.chart) {
        if (this.showWeather) {
          this.weather.forEach(element => {
            this.chart.data.datasets.push({
              ...element,
              weather: true,
              yAxisID: 'y2'
            });
          });
        } else {
          this.chart.data.datasets = this.chart.data.datasets.filter((dataset: any) => !dataset.weather);
        }
        this.chart.update();
      }
    }
  }


  ngOnInit() {
    Chart.register(...registerables);
    const canvasElement = document.getElementById("chartForComparison");

    if (canvasElement) {
      canvasElement.id = this.chartId;

      const data = {
        labels: this.labels,
        datasets: this.dataset
      };
      const config: any = {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: this.chartHeading
            },
          },
          interaction: {
            intersect: false,
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Čas'
              }
            },
            y: {
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Počet Cyklistov'
              },
              suggestedMin: -10,
              suggestedMax: 110
            },
            y2: {
              display: false,
              position: 'right',
              title: {
                display: true,
                text: 'Počasie'
              },
              suggestedMax: 30
            },
          }
        },
      };
      if (this.showWeather) {
        this.weather.forEach(element => {
          config.data.datasets.push({
            ...element,
            yAxisID: 'y2'
          });
        });
      }

      this.chart = new Chart(this.chartId, config);
    }
  }
}
