import { AfterContentInit, Component, ContentChild, ContentChildren, Input, OnInit, QueryList, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-col-table',
 template: ''
})
export class ColTableComponent implements OnInit, AfterContentInit {

  @Input() header!: string;
  @Input() key!: string;
  @Input() type: string = 'text' || 'number' || 'percent';
  @Input() align: string = 'left' || 'center' || 'right';
  @Input() width!: string;
  @Input() isSort: boolean = false;
  @Input() canFilter: boolean = false;
  @Input() filterCol: any;
  @Input() maxWidth!: string;

  @ContentChild('cellTable') cellTemplate!: TemplateRef<any>
  @ContentChild('headerTable') headerTemplate!: TemplateRef<any>

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
  }

}
