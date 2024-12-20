import { Component, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { EditSettingsModel, GridComponent, GridLine, GroupSettingsModel, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
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
  statusList:string[]=['In(Check)', 'In','In(Weight)','Operation','Out(Weight)', 'Out(Check)', 'Out'];
  // statusList:any[];
  public data: Object[];
  public placeholder: string = 'Select One';
  public mode?: string;
  public selectAllText: string| any;
  public groupOptions: GroupSettingsModel;
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
    this.groupOptions = { showDropArea: false, columns: ['groupName'] };
    this.getLocationList();
    this.optionForm = new FormGroup({
      fromDate: new FormControl(sessionStorage.getItem("tsfromDate")?sessionStorage.getItem("tsfromDate"):this.today,Validators.required),
      toDate: new FormControl(sessionStorage.getItem("tstoDate")?sessionStorage.getItem("tstoDate"):this.today,Validators.required),
      yardID: new FormControl(sessionStorage.getItem("tsloc")?sessionStorage.getItem("tsloc"):null,Validators.required),
      status: new FormControl(sessionStorage.getItem("tstatus")?sessionStorage.getItem("tstatus").split(','):null,Validators.required),
    });
  }

  getLocationList() {
    this.spinner.show();
    this.service.getYardList('true')
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.yardList = result;
        // this.optionForm.controls['yardID'].setValue(sessionStorage.getItem("tsloc")?sessionStorage.getItem("tsloc").split(','):null);
        this.spinner.hide();
    });
  }

  // getBadgeColor(status: string): string {
  //  switch (status) {
  //     case 'In(Check)':
  //         return '#519df4'; // Orchid
  //     case 'In':
  //         return 'rgb(106, 90, 205)'; // Purple
  //     case 'Out(Check)':
  //         return 'rgba(40, 167, 69, 0.8)'; // Medium Green
  //     case 'Out':
  //         return 'rgb(140, 140, 140)'; // Gray
  //     default:
  //         return 'rgb(199, 73, 73)'; // Red for unknown status
  //  }
  // }

  getBadgeColor(status: string): string {
    switch (status) {
      case 'In(Check)':
        return ' rgb(248, 144, 32)'; // orange
      case 'In':
        return ' rgb(171, 127, 195)'; // Purple
       case 'In(Weight)':
           return '#d83ad8'; // Orchid
       case 'Operation':
           return '#0dcaf0'; // info
       case 'Out(Weight)':
           return 'rgb(23, 117, 223)'; // primary
       case 'Out(Check)':
           return 'rgba(52, 187, 52, 0.8)'; // Medium Green
       case 'Out':
           return 'rgb(23, 106, 23)'; // Green
       default:
           return 'rgb(199, 73, 73)'; // Red for unknown status
    }
   }

  loadTableData() {
    this.spinner.show();
    const formData = this.optionForm.value;
    const fromDate = moment(formData.fromDate).format('MM/DD/YYYY');
    const toDate =  moment(formData.toDate).format('MM/DD/YYYY');
    let sloc:any='';
    if (formData.status?.length > 0) {
      sloc = this.formatParams(formData.status);
    }
     sessionStorage.setItem('tsfromDate', fromDate);
     sessionStorage.setItem('tstoDate', toDate);
     sessionStorage.setItem('tsloc', formData.yardID);
     sessionStorage.setItem('tstatus', formData.status);

     this.service.getTruckProcessList(fromDate,toDate,sloc,formData.yardID)
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
