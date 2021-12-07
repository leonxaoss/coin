import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CoinInterface } from '../../../../shared/interfaces/coin.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChartComponent } from '../chart/chart.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [ DialogService ]
})
export class TableComponent implements OnInit {

  tableSort = {
    column: '',
    isAscSort: false
  };
  refNote: DynamicDialogRef | undefined;

  @ViewChild('table', {static: true}) table: ElementRef | undefined;

  @Input() coins: CoinInterface[] = [];
  @Input() showLoader = false;
  @Output() onRemove = new EventEmitter<string>();

  constructor(public dialogService: DialogService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    if (this.refNote) {
      this.refNote.close();
    }
  }

  public removeCoin(coinId: string): void {
    this.onRemove.emit(coinId);
  }

  public showHistory(coin: CoinInterface): void {
    this.refNote = this.dialogService.open(ChartComponent, {
      data: coin,
      header: coin.name,
      width: '95vw',
      styleClass: 'chart__dialog'
    });
  }

  public sortTable(columnName: string): void {

    const ascSort = (a: any, b: any) => {
      if ( a[columnName] < b[columnName] ) {
        return -1;
      }
      if ( a[columnName] > b[columnName] ) {
        return 1;
      }
      return 0;
    };
    const descSort = (a: any, b: any) => {
      if ( a[columnName] > b[columnName] ) {
        return -1;
      }
      if ( a[columnName] < b[columnName] ) {
        return 1;
      }
      return 0;
    };

    if (columnName !== this.tableSort.column) {
      this.tableSort.isAscSort = true;
    } else {
      this.tableSort.isAscSort = !this.tableSort.isAscSort;
    }

    const sortStrategy = this.tableSort.isAscSort ? ascSort : descSort;
    this.coins = this.coins.sort(sortStrategy);
    this.tableSort.column = columnName;
  }

  isCurrentColumn(columnName: string): boolean {
    return this.tableSort.column === columnName;
  }

  getSortStrategy(): string{
    return this.tableSort.isAscSort ? 'asc' : 'desc';
  }

  public exportCsv(): void {

    const filename = `export_file_${this.datePipe.transform(new Date(), 'dd.MM.yyyy_hh_mm')}.csv`;
    const data = [];
    const rows = this.table?.nativeElement.querySelectorAll('tr');

    for (let i = 0; i < rows.length; i++) {
      const row = [], cols = rows[i].querySelectorAll('td, th');

      for (let j = 0; j < cols.length - 1; j++) {
        row.push(cols[j]?.innerText);
      }

      data.push(row.join(","));
    }

    const csv_file = new Blob([data.join('\n')], {type: 'text/csv'});
    const download_link = document.createElement('a');

    download_link.download = filename;
    download_link.href = window.URL.createObjectURL(csv_file);
    download_link.style.display = 'none';
    document.body.appendChild(download_link);
    download_link.click();
    setTimeout(() => {
      download_link.remove();
    }, 500);
  }

}
