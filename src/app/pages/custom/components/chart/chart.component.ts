import { Component, ElementRef, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CryptoService } from '../../../../providers/services/crypto.service';
import { HistoryResponseInterface } from '../../../../shared/interfaces/history-response.interface';
import { HistoryInterface } from '../../../../shared/interfaces/history.interface';
import { DataChartInterface } from '../../shared/interfaces/data-chart.interface';
import * as d3 from 'd3';
import { Selection } from 'd3-selection';
import { ScaleTime } from 'd3';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  private width = 700;
  private height = 700;
  private margin = 50;
  private defaultColor = '#000000'

  public svg: Selection<SVGSVGElement, unknown, HTMLElement, any> | undefined;
  public svgInner: Selection<SVGGElement, unknown, HTMLElement, any> | undefined;
  public yScale: ScaleTime<number, number, never> | any;
  public xScale: ScaleTime<number, number, never> | any;
  public xAxis: Selection<SVGGElement, unknown, HTMLElement, any> | undefined;
  public yAxis: Selection<SVGGElement, unknown, HTMLElement, any> | undefined;
  public lineGroup: Selection<SVGPathElement, unknown, HTMLElement, any> | undefined;

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

  private mapData(data: HistoryInterface[]): DataChartInterface[] {
    return data.map((result: HistoryInterface) => {
      return {
        date: result.timestamp * 1000,
        value: +result.price
      }
    });
  }

  private initializeChart(data: DataChartInterface[]): void {
    this.svg = d3
      .select('.chart')
      .append('svg')
      .attr('height', this.height);
    this.svgInner = this.svg
      .append('g')
      .style('transform', 'translate(' + this.margin + 'px, ' + this.margin + 'px)');

    this.yScale = d3
      .scaleLinear()
      .domain([d3.max(data, (d: DataChartInterface) => d.value) as number * 1.015, d3.min(data, (d: DataChartInterface) => d.value) as number * 0.98])
      .range([0, this.height - 2 * this.margin]);

    this.yAxis = this.svgInner
      .append('g')
      .attr('id', 'y-axis')
      .style('transform', 'translate(' + this.margin + 'px,  0)');

    const arr = d3.extent(data, (d: DataChartInterface) => d.date) as number[];

    this.xScale = d3.scaleTime().domain(arr);
    console.log(this.xScale);

    this.xAxis = this.svgInner
      .append('g')
      .attr('id', 'x-axis')
      .style('transform', 'translate(0, ' + (this.height - 2 * this.margin) + 'px)');

    this.lineGroup = this.svgInner
      .append('g')
      .append('path')
      .attr('id', 'line')
      .style('fill', 'none')
      .style('stroke', this.config.data.color ? this.config.data.color : this.defaultColor)
      .style('stroke-width', '1px')
  }

  private drawChart(data: DataChartInterface[]): void {
    this.width = this.chartElem.nativeElement.getBoundingClientRect().width;
    this.svg?.attr('width', this.width);

    this.xScale?.range([this.margin, this.width - 2 * this.margin]);

    const xAxis = d3
      .axisBottom(this.xScale)
      .ticks(10)

    this.xAxis?.call(xAxis);

    const yAxis = d3
      .axisLeft(this.yScale);

    this.yAxis?.call(yAxis);

    const line = d3
      .line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveMonotoneX);

    const points: [number, number][] = data.map((d: DataChartInterface) => [
      this.xScale(new Date(d.date)),
      this.yScale(d.value),
    ]);

    this.lineGroup?.attr('d', line(points));
  }
}
