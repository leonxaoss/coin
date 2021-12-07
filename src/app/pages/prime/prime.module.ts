import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PrimeRoutingModule } from './prime-routing.module';
import { PrimeComponent } from './prime.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ChartComponent } from './components/chart/chart.component';
import { SharedModulesModule } from '../../modules/shared-modules.module';
import { ChartModule } from 'primeng/chart';
import { RippleModule } from 'primeng/ripple';


@NgModule({
  declarations: [
    PrimeComponent,
    ChartComponent
  ],
    imports: [
        CommonModule,
        PrimeRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        SharedModulesModule,
        ChartModule,
        RippleModule,
    ],
  providers: [
    DatePipe,
  ]
})
export class PrimeModule { }
