import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../providers/services/crypto.service';
import { ResponseCoinsInterface } from '../../shared/interfaces/response-coins.interface';
import { CoinInterface } from '../../shared/interfaces/coin.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { ParamsInterface } from '../../shared/interfaces/params.interface';
import { Params } from '../../shared/classes/params';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-custom',
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.scss']
})
export class CustomComponent implements OnInit {

  coins: CoinInterface[] = [];
  coinsList: CoinInterface[] = [];
  coinsHistory: CoinInterface[] = [];
  params: ParamsInterface = new Params(50, [
    'Qwsogvtv82FCd',
    'razxDUgYGNAdQ',
    'f3iaFeCKEmkaZ'
  ])
  form = this.fb.group({
    coin: [null, [Validators.required]],
  });
  showTableLoader = true;
  refNote: DynamicDialogRef | undefined;


  constructor(private cryptoService: CryptoService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getCoinsList();
    this.getCoins(this.params);
  }

  private getCoins(params: ParamsInterface): void {
    this.cryptoService.getCoins(params)
      .pipe(take(1))
      .subscribe((res: ResponseCoinsInterface) => {
        this.showTableLoader = false;
        this.coins = res.data.coins;
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

  public onSubmit(): void {
    const isAdded = this.coins.find(item => item.uuid === this.form.value.coin);
    if(this.form.invalid || isAdded) {
      return;
    }

    this.getCoin(this.form.value.coin);
  }

  public removeCoin(id: string): void {
    this.coins.splice(this.coins.findIndex(res => res.uuid === id), 1);
    this.params.uuids.splice(this.params.uuids.findIndex(res => res === id), 1);
  }

  public checkOption(uuid: string): boolean {
    return !!this.params.uuids.find(item => item === uuid)
  }

}
