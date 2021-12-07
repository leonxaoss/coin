import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CryptoService } from '../../../../providers/services/crypto.service';
import { HistoryResponseInterface } from '../../../../shared/interfaces/history-response.interface';
import { HistoryInterface } from '../../../../shared/interfaces/history.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  data = {
    labels: [''],
    datasets: [
      {
        label: 'First Dataset',
        data: [0],
        borderColor: '',
        tension: 0
      }
    ]
  };
  showLoader = true;

  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private cryptoService: CryptoService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getCoinHistory(this.config.data.uuid);
  }

  private getCoinHistory(uuid: string, timePeriod?: string): void {
    this.cryptoService.getCoinHistory(uuid, timePeriod).subscribe((res: {data: HistoryResponseInterface}) => {
      this.createNewDataChart(res.data.history)

      this.showLoader = false;
    })
  }

  private createNewDataChart(data: HistoryInterface[]): void {
    const labelsChart = data.map((result: HistoryInterface) => {
      return this.datePipe.transform(result.timestamp * 1000, 'dd.MM.yyyy hh:mm');
    });
    const priceData = data.map((result: HistoryInterface) => {
      return +result.price;
    });

    this.data = {
      labels: labelsChart as string[],
      datasets: [
        {
          label: this.config.data.name,
          data: priceData,
          borderColor: this.config.data.color,
          tension: 0.4
        }
      ]
    }
  }

}
