import { CoinInterface } from './coin.interface';
import { StatsInterface } from './stats.interface';

export interface ResponseCoinsInterface {
  data: {
    coins: CoinInterface[]
    stats: StatsInterface;
  }
  status: string;
}
