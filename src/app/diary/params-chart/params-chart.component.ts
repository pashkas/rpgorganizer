import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { PersService } from 'src/app/pers.service';
import { Pers } from 'src/Models/Pers';

@Component({
  selector: 'app-params-chart',
  templateUrl: './params-chart.component.html',
  styleUrls: ['./params-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParamsChartComponent implements OnInit {
  @Input() chartData: ChartDataSets[] = [];
  @Input() chartLabels: Label[] = [];
  @Output() onClick = new EventEmitter<number>();
  @Output() onLegendClick = new EventEmitter<number>();
  
  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    //aspectRatio: 1.618,
    
    scales: { xAxes: [{}], yAxes: [{ ticks: { min: 0, max: 10 } }] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    },
    legend:{
      onClick: (e, legendItem) => 
      {
        this.onLegendClick.emit(legendItem.datasetIndex); 
      }
    }
  };
  @Input() pers: Pers;

  // events
  public chartClicked({ active }: { active: any }): void {
   
    if (active && active[0]) {
      this.onClick.emit(active[0]._index);
    }
  }

  ngOnInit() {
  }
}
