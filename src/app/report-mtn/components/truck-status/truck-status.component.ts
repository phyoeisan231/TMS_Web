import { Component, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { EditSettingsModel, GridComponent, GridLine, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import moment from 'moment';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ReportMtnModule } from '../../report-mtn.module';
import { TruckStatusService } from './truck-status.service';
@Component({
  selector: 'app-truck-status',
  standalone: true,
  imports: [ReportMtnModule],
  templateUrl: './truck-status.component.html',
  styleUrl: './truck-status.component.scss'
})
export class TruckStatusComponent {
  pageSettings: PageSettingsModel = { pageSize: 50 };
  editSettings: EditSettingsModel = { allowEditing: false, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = ['ExcelExport','Search'];
  lines: GridLine = 'Both';
  optionForm: FormGroup;
  submitClicked: boolean = false;
  public formatfilter: any ="MM/dd/yyyy";
  yardList:[]=[];
  endDate : Date = new Date();
  today : Date = new Date();
  statusList:any[]=['In(Check)','In','Out(Check)','Out'];
  // statusList:any[];
  public data: Object[];
  public placeholder: string = 'Select One';
  public mode?: string;
  public selectAllText: string| any;
  @ViewChild('Grid') public grid: GridComponent;
   // end multi file upload
  constructor(
    private service: TruckStatusService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {}

  ngOnInit(){
    this.mode = 'CheckBox';
    // set the select all text to MultiSelect checkbox label.
    this.selectAllText= 'Select All';
    this.getLocationList();
    this.optionForm = new FormGroup({
      fromDate: new FormControl(sessionStorage.getItem("icfromDate")?sessionStorage.getItem("icfromDate"):this.today,Validators.required),
      toDate: new FormControl(sessionStorage.getItem("ictoDate")?sessionStorage.getItem("ictoDate"):this.today,Validators.required),
      yardID: new FormControl(sessionStorage.getItem("icloc")?sessionStorage.getItem("icloc").split(','):null,Validators.required),
      status: new FormControl(sessionStorage.getItem("icstatus")?sessionStorage.getItem("icstatus").split(','):null,Validators.required),
    });
  }

  getLocationList() {
    this.spinner.show();
    this.service.getYardList('true')
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.yardList = result;
        this.optionForm.controls['yardID'].setValue(sessionStorage.getItem("icloc")?sessionStorage.getItem("icloc").split(','):null);
        this.spinner.hide();
    });
  }


getBadgeColor(status: string): string {
  switch (status) {
      case 'In(Check)':
          return 'rgb(216, 58, 216)'; // Orchid
      case 'In':
          return 'rgb(106, 90, 205)'; // Purple
      case 'Out(Check)':
          return 'rgba(40, 167, 69, 0.8)'; // Medium Green
      case 'Out':
          return 'rgb(140, 140, 140)'; // Gray
      default:
          return 'rgb(250, 0, 0)'; // Red for unknown status
  }
}

  loadTableData() {
    this.spinner.show();
    const formData = this.optionForm.value;
    const fromDate = moment(formData.fromDate).format('MM/DD/YYYY');
    const toDate =  moment(formData.toDate).format('MM/DD/YYYY');
    let loc:any ='';
    let sloc:any='';
    if (formData.yardID?.length > 0 && formData.status?.length > 0) {
      loc = this.formatParams(formData.yardID);
      sloc = this.formatParams(formData.status);
    }
     sessionStorage.setItem('icfromDate', fromDate);
     sessionStorage.setItem('ictoDate', toDate);
     sessionStorage.setItem('icloc', JSON.stringify(formData.yardID));
     sessionStorage.setItem('icstatus', JSON.stringify(formData.status));

     this.service.getTruckProcessList(fromDate,toDate,sloc,loc)
     .pipe(catchError((err) => of(this.showError(err))))
       .subscribe((result) => {
         this.grid.dataSource= result;
         this.grid.searchSettings.operator = "equal";
         this.grid.refresh();
         this.spinner.hide();
     });
  }

  formatParams(paramArray) {
    return paramArray.map(item => `'${item}'`).join(',');
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('Truck Process', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Truck Process', error.statusText, 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport({
        fileName:'TruckProcessReport.xlsx',
     });
    }
  }

}
