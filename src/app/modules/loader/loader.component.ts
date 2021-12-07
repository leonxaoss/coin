import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @Input() local = false;
  @Input() showLoader = false;

  constructor() { }

  ngOnInit(): void {
  }

}
