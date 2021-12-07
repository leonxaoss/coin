import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CustomRoutingModule } from './custom-routing.module';
import { CustomComponent } from './custom.component';
import { TableComponent } from './components/table/table.component';
import { SharedModulesModule } from '../../modules/shared-modules.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { ChartComponent } from './components/chart/chart.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';


@NgModule({
  declarations: [
    CustomComponent,
    TableComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    CustomRoutingModule,
    SharedModulesModule,
    ReactiveFormsModule,
    ChartModule,
    DynamicDialogModule,
  ],
  providers: [
    DatePipe,
  ]
})
export class CustomModule {}
