import { Component, OnInit } from '@angular/core';
import { CoinInterface } from '../../shared/interfaces/coin.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { CryptoService } from '../../providers/services/crypto.service';
import { take } from 'rxjs';
import { ResponseCoinsInterface } from '../../shared/interfaces/response-coins.interface';
import { LazyLoadEvent } from 'primeng/api';
import { ParamsInterface } from '../../shared/interfaces/params.interface';
import { Params } from '../../shared/classes/params';
import { ChartComponent } from './components/chart/chart.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-prime',
  templateUrl: './prime.component.html',
  styleUrls: ['./prime.component.scss'],
  providers: [ DialogService ]
})
export class PrimeComponent implements OnInit {

  coins: CoinInterface[] = [];
  coinsList: CoinInterface[] = [];
  coinsHistory: CoinInterface[] = [];
  totalRecords = 0;
  itemsPerPage = 50;
  form = this.fb.group({
    coin: [null, [Validators.required]],
  });
  showTableLoader = true;
  params: ParamsInterface = new Params(this.itemsPerPage, [
    'Qwsogvtv82FCd',
    'razxDUgYGNAdQ',
    'f3iaFeCKEmkaZ'
  ]);
  refNote: DynamicDialogRef | undefined;

  constructor(private cryptoService: CryptoService,
              private fb: FormBuilder,
              public dialogService: DialogService) { }

  ngOnInit(): void {
    this.getCoinsList();
  }

  ngOnDestroy(): void {
    if (this.refNote) {
      this.refNote.close();
    }
  }

  public checkOption(uuid: string): boolean {
    return !!this.params.uuids.find(item => item === uuid)
  }

  public onSubmit(): void {
    const isAdded = this.coins.find(item => item.uuid === this.form.value.coin);
    if(this.form.invalid || isAdded) {
      return;
    }

    this.getCoin(this.form.value.coin);
  }

  loadData(event: LazyLoadEvent): void {
    this.showTableLoader = true;
    this.updateParams(event, this.params);
    this.getCoins(this.params);
  }

  private getCoins(params: ParamsInterface): void {
    this.cryptoService.getCoins(params)
      .pipe(take(1))
      .subscribe((res: ResponseCoinsInterface) => {
        this.showTableLoader = false;
        this.coins = res.data.coins;
        this.totalRecords = res.data.stats.total
      })
  }

  private getCoinsList(): void {
    this.cryptoService.getCoins(new Params())
      .pipe(take(1))
      .subscribe((res: ResponseCoinsInterface) => {
        this.coinsList = res.data.coins;
      })
  }

  private getCoin(uuid: string): void {
    this.showTableLoader = true;
    this.cryptoService.getCoin(uuid).subscribe(res => {
      this.showTableLoader = false;
      this.coins.push(res.data.coin);
      this.params.uuids.push(res.data.coin.uuid);
      this.form.reset();
    })
  }

  private updateParams(paramsTable: LazyLoadEvent, params: ParamsInterface): void {
    params.orderBy = paramsTable.sortField ? paramsTable.sortField : '';
    params.orderDirection = paramsTable.sortOrder && paramsTable.sortOrder < 1 ? 'asc' : 'desc';
    params.offset = paramsTable.first ? paramsTable.first : 0;
  }

  public removeCoin(id: string): void {
    this.coins.splice(this.coins.findIndex(res => res.uuid === id), 1);
    this.params.uuids.splice(this.params.uuids.findIndex(res => res === id), 1);
  }

  public showHistory(coin: CoinInterface): void {
    this.refNote = this.dialogService.open(ChartComponent, {
      data: coin,
      header: coin.name,
      width: '95vw',
      styleClass: 'chart__dialog'
    });
  }

}
