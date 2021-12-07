import { ParamsInterface } from '../interfaces/params.interface';

export class Params implements ParamsInterface{
  uuids: string[] = [];
  timePeriod = '30d';
  orderBy = '';
  search = '';
  orderDirection = 'desc';
  limit = 0;
  offset = 0;

  constructor(itemsPerPage = 50, uuids: string[] = []) {
    this.limit = itemsPerPage;
    this.uuids = uuids;
  }
}
