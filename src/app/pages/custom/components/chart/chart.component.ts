import { Component, ElementRef, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CryptoService } from '../../../../providers/services/crypto.service';
import { HistoryResponseInterface } from '../../../../shared/interfaces/history-response.interface';
import { HistoryInterface } from '../../../../shared/interfaces/history.interface';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  private width = 700;
  private height = 700;
  private margin = 50;

  public svg: any;
  public svgInner: any;
  public yScale: any;
  public xScale: any;
  public xAxis: any;
  public yAxis: any;
  public lineGroup: any;

  showLoader = true;

  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private cryptoService: CryptoService,
              public chartElem: ElementRef) { }

  ngOnInit(): void {
    this.getCoinHistory(this.config.data.uuid);
  }

  private getCoinHistory(uuid: string, timePeriod?: string): void {
    this.cryptoService.getCoinHistory(uuid, timePeriod).subscribe((res: {data: HistoryResponseInterface}) => {
      const chart = this.mapData(res.data.history);

      this.initializeChart(chart);
      this.drawChart(chart);
      this.showLoader = false;
    })
  }

  private mapData(data: HistoryInterface[]): { date: number, value: number }[] {
    return data.map((result: HistoryInterface) => {
      return {
        date: result.timestamp * 1000,
        value: +result.price
      }
    });
  }

  private initializeChart(data: { date: number, value: number }[]): void {
    this.svg = d3
      .select('.chart')
      .append('svg')
      .attr('height', this.height);
    this.svgInner = this.svg
      .append('g')
      .style('transform', 'translate(' + this.margin + 'px, ' + this.margin + 'px)');

    this.yScale = d3
      .scaleLinear()
      .domain([d3.max(data, (d: any) => d.value) + 1, d3.min(data, (d: any) => d.value) - 1])
      .range([0, this.height - 2 * this.margin]);

    this.yAxis = this.svgInner
      .append('g')
      .attr('id', 'y-axis')
      .style('transform', 'translate(' + this.margin + 'px,  0)');

    // @ts-ignore
    this.xScale = d3.scaleTime().domain(d3.extent(data, d => new Date(d.date)));

    this.xAxis = this.svgInner
      .append('g')
      .attr('id', 'x-axis')
      .style('transform', 'translate(0, ' + (this.height - 2 * this.margin) + 'px)');

    this.lineGroup = this.svgInner
      .append('g')
      .append('path')
      .attr('id', 'line')
      .style('fill', 'none')
      .style('stroke', this.config.data.color)
      .style('stroke-width', '2px')
  }

  private drawChart(data: any): void {
    this.width = this.chartElem.nativeElement.getBoundingClientRect().width;
    this.svg.attr('width', this.width);

    this.xScale.range([this.margin, this.width - 2 * this.margin]);

    const xAxis = d3
      .axisBottom(this.xScale)
      .ticks(10)

    this.xAxis.call(xAxis);

    const yAxis = d3
      .axisLeft(this.yScale);

    this.yAxis.call(yAxis);

    const line = d3
      .line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveMonotoneX);

    const points: [number, number][] = data.map((d: any) => [
      this.xScale(new Date(d.date)),
      this.yScale(d.value),
    ]);

    this.lineGroup.attr('d', line(points));
  }
}
