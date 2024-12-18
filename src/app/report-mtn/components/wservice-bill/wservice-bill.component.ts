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
import { WserviceBillService } from './wservice-bill.service';
@Component({
  selector: 'app-wservice-bill',
  standalone: true,
  imports: [ReportMtnModule],
  templateUrl: './wservice-bill.component.html',
  styleUrl: './wservice-bill.component.scss'
})
export class WServiceBillComponent {
  pageSettings: PageSettingsModel = { pageSize: 50 };
  editSettings: EditSettingsModel = { allowEditing: false, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = ['ExcelExport','Search'];
  lines: GridLine = 'Both';
  optionForm: FormGroup;
  submitClicked: boolean = false;
  public formatfilter: any ="MM/dd/yyyy";
  gateList:[]=[];
  endDate : Date = new Date();
  today : Date = new Date();
  public data: Object[];
  // public placeholder: string = 'Select One';
  public mode?: string;
  public selectAllText: string| any;
  @ViewChild('Grid') public grid: GridComponent;
   // end multi file upload
  constructor(
    private service: WserviceBillService,
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
      gateID: new FormControl(sessionStorage.getItem("icloc")?sessionStorage.getItem("icloc").split(','):null,Validators.required),
      // status: new FormControl(sessionStorage.getItem("icstatus")?sessionStorage.getItem("icstatus").split(','):null,Validators.required),
    });
  }

  getLocationList() {
    this.spinner.show();
    this.service.GetGateList('All')
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.gateList = result;
        this.optionForm.controls['gateID'].setValue(sessionStorage.getItem("icloc")?sessionStorage.getItem("icloc").split(','):null);
        this.spinner.hide();
    });
  }

  loadTableData() {
    this.spinner.show();
    const formData = this.optionForm.value;
    const fromDate = moment(formData.fromDate).format('MM/DD/YYYY');
    const toDate =  moment(formData.toDate).format('MM/DD/YYYY');
    let loc:any ='';
    if (formData.gateID?.length > 0) {
      loc = this.formatParams(formData.gateID);
    }
     sessionStorage.setItem('icfromDate', fromDate);
     sessionStorage.setItem('ictoDate', toDate);
     sessionStorage.setItem('icloc', JSON.stringify(formData.gateID));
    //  sessionStorage.setItem('icstatus', JSON.stringify(formData.status));

     this.service.getServiceBillList(fromDate,toDate,loc)
     .pipe(catchError((err) => of(this.showError(err))))
       .subscribe((result) => {
         this.grid.dataSource= result;
         this.grid.searchSettings.operator = "equal";
         this.grid.refresh();
         this.spinner.hide();
     });
  }

  getBadgeColor(status: string): string {
    switch (status) {
       case 'In(Check)':
           return '#519df4'; // Orchid
       case 'In':
           return 'rgb(106, 90, 205)'; // Purple
       case 'Out(Check)':
           return 'rgba(40, 167, 69, 0.8)'; // Medium Green
       case 'Out':
           return 'rgb(140, 140, 140)'; // Gray
       default:
           return 'rgb(199, 73, 73)'; // Red for unknown status
    }
   }

  formatParams(paramArray) {
    return paramArray.map(item => `'${item}'`).join(',');
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('Weight Service Bill', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Weight Service Bill', error.statusText, 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport({
        fileName:'WeightServiceBillReport.xlsx',
     });
    }
  }

}
