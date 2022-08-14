import { AfterContentInit, Component, ContentChildren, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef, ViewChild } from "@angular/core";
import { ColTableComponent } from "../col/col.component";
import { FormGroup } from "@angular/forms";
import { BehaviorSubject, fromEvent, ReplaySubject } from "rxjs";
import { debounceTime, distinctUntilChanged, filter, map } from "rxjs/operators";


@Component({
  selector: 'app-table-component',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  
})
export class TableComponent implements OnInit, AfterContentInit {
  settingForm?: FormGroup;
  listOfData: readonly any[] = [];
  displayData: readonly any[] = [];
  listOfCurrentPageData: readonly any[] = [];
  allChecked = false;
  indeterminate = false;
  fixedColumn = false;
  scrollX: string | null = null;
  scrollY: string | null = null;
  keyword: string = "";
  setOfCheckedId = new Set<number>();
  
  destroyed$ = new ReplaySubject<boolean>(1);
  @ViewChild('inputSearch') inputSearch!: ElementRef;

  private _data = new BehaviorSubject<any[]>([]);
  @Input()
  set datas(value) {
    this._data.next(value);
  };

  get datas() {
    return this._data.getValue();
  }

  @Input() isLoading = false;
  @Input() bordered = false;
  @Input() clientPagingation = false;
  @Input() totalRecords!: number;
  @Input() totalPage = 10;
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  @Input() gridSize: 'middle' | 'default' | 'small' = 'middle';
  @Input() checked = true;
  @Input() showPagingation = true;
  @Input() showSizeChange = true;
  @Input() sortField!: string;
  @Input() sortDirection!: string;
  @Input() data: any[] = [];
  @Input() canEdit = true;
  @Input() canDelete = true;
  @Input() canSearch = true;
  @Input() canFilter = true;
  @Input() canExport = true;
  @Input() canImport = false;
  @Input() canCreate = true;
  @Input() canAction = true;
  @Input() canPaging = true;
  @Input() canSelect = true;
  @Input() filterColumn: any;
  @Input() totalFilter: number = 0;
  @Input() warning = false;
  @Input() showHistory = false;
  @Input() textPlaceholder = "Tìm kiếm";
  @Input() displayFilterBtn = false;
  @Input() displayImportBtn = false;

  

  @Output() rowClick = new EventEmitter();
  @Output() pageIndexChange = new EventEmitter();
  @Output() pageSizeChange = new EventEmitter();
  @Output() showHistoryButtonClick = new EventEmitter();
  @Input() isDisplayDeleteButton = false;
  @Output() editButtonClick = new EventEmitter();
  @Output() deleteButtonClick = new EventEmitter();
  @Output() createButton = new EventEmitter();
  @Output() searchInput = new EventEmitter();
  @Output() exportExecel = new EventEmitter();
  @Output() deleteSelected = new EventEmitter();
  @Output() sortColumn = new EventEmitter();
  @Output() filterClick = new EventEmitter();
  @Output() importClick = new EventEmitter();

  @ContentChildren(ColTableComponent) columns!: QueryList<ColTableComponent>;
  @ContentChildren('headerTable', { descendants: true }) headerParentTmp!: QueryList<TemplateRef<any>>

  constructor() {}

  ngOnInit(): void {
    this.listOfData = this.data;
    this.displayData = this.listOfData
  }
  ngAfterViewInit(): void {
    if (this.inputSearch) {
      fromEvent(this.inputSearch.nativeElement, 'keyup')
        .pipe(
          filter(Boolean),
          debounceTime(600),
          distinctUntilChanged(),
          map((event: any) => event.target.value)
        )
        .subscribe(response => {
          this.keyword = response;
          this.searchInput.emit(response.trim());
        });
    }
  }
  
  ngAfterContentInit(): void {

  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  onSearch(): void {
    this.searchInput.emit(this.keyword);
  }

  onImport(): void {
    this.canImport = !this.canImport;
    this.importClick.emit(this.canImport)
  }

  onFilter(): void {
    this.canFilter = !this.canFilter;
    this.filterClick.emit(this.canFilter)
  }

  // show history record
  onShowHistory(data: any): void {
    if (this.showHistoryButtonClick) {
      this.showHistoryButtonClick.emit(data);
    }
  }


  // click record
  onRowClick(data: any) {
    this.rowClick.emit(data);
  }

  onCreate(): void {
    this.createButton.emit();
  }

  // edit record
  onEditRow(data: any): void {
    if (this.editButtonClick) {
      this.editButtonClick.emit(data);
    }
  }

  // delete record
  onDeleteRow(data: any): void {
    if (this.deleteButtonClick) {
      this.deleteButtonClick.emit(data);
    }
  }

  onDeleteSelected(): void {
    if (this.deleteSelected) {
      this.deleteSelected.emit(this.setOfCheckedId);
    }
  }


  onPageIndexChange(pageIndex: number): void {
    if (this.pageIndexChange) {
      this.pageIndexChange.emit(pageIndex);
    }
  }

  onPageSizeChange(pageSize: number): void {
    if (this.pageSizeChange) {
      this.pageSizeChange.emit(pageSize);
    }
  }

  onExport(): void {
    const checkedData = this.setOfCheckedId;
    this.exportExecel.emit(checkedData);
  }

  //Checkbox
  updateCheckedSet(id: number, checked: boolean): void {
    this.isDisplayDeleteButton = true;
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onCurrentPageDataChange(listOfCurrentPageData: readonly any[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData
      .filter(({ disabled }) => !disabled)
      .forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  onQueryParamsChange(data: any): void {
    this.sortColumn.emit(data);
  }
  
}
