import { Component, ViewChild } from '@angular/core';
import { ReportMtnModule } from '../../report-mtn.module';
import { EditSettingsModel, GridComponent, GridLine, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GateInService } from './gate-in.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import moment from 'moment';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-gate-in',
  standalone: true,
  imports: [ReportMtnModule],
  templateUrl: './gate-in.component.html',
  styleUrl: './gate-in.component.scss'
})
export class GateInComponent {
  pageSettings: PageSettingsModel = { pageSize: 50 };
  editSettings: EditSettingsModel = { allowEditing: false, allowAdding: false, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = ['ExcelExport','Search'];
  lines: GridLine = 'Both';
  optionForm: FormGroup;
  submitClicked: boolean = false;
  public formatfilter: any ="MM/dd/yyyy";
  yardList:[]=[];
  endDate : Date = new Date();
  today : Date = new Date();
  public data: Object[];
  public placeholder: string = 'Select One';
  public mode?: string;
  public selectAllText: string| any;
  @ViewChild('Grid') public grid: GridComponent;
   // end multi file upload
  constructor(
    private service: GateInService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {}

  ngOnInit(){
    // set the type of mode for checkbox to visualized the checkbox added in li element.
    this.mode = 'CheckBox';
    // set the select all text to MultiSelect checkbox label.
    this.selectAllText= 'Select All';
    this.getLocationList();
    this.optionForm = new FormGroup({
      fromDate: new FormControl(sessionStorage.getItem("ifromDate")?sessionStorage.getItem("ifromDate"):this.today,Validators.required),
      toDate: new FormControl(sessionStorage.getItem("itoDate")?sessionStorage.getItem("itoDate"):this.today,Validators.required),
      yardID: new FormControl(sessionStorage.getItem("iloc")?sessionStorage.getItem("iloc").split(','):null,Validators.required),
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


  loadTableData() {
   this.spinner.show();
   const formData = this.optionForm.value;
   const fromDate = moment(formData.fromDate).format('MM/DD/YYYY');
   const toDate =  moment(formData.toDate).format('MM/DD/YYYY');
   let loc:any ="";
   if(formData.yardID.length>0){
    loc = this.formatParams(formData.yardID);
   }
    sessionStorage.setItem("ifromDate", fromDate);
    sessionStorage.setItem("itoDate", toDate);
    sessionStorage.setItem("iloc", formData.yardID);
    this.service.getGateInList(fromDate,toDate,loc)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.grid.dataSource= result;
        this.spinner.hide();
    });
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].inRegNo;
      const user = localStorage.getItem('currentUser');
      this.deleteInBoundCheck(id,user);
    }
  }

  formatParams(paramArray) {
    return paramArray.map(item => `'${item}'`).join(',');
  }


  deleteInBoundCheck(id: any,user:string) {
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'You will not be able to recover this data!',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#DD6B55',
    //   cancelButtonText: 'No, keep it',
    //   confirmButtonText: 'Yes, I am sure!',
    // }).then((response: any) => {
    //   if (response.value) {
    //     this.spinner.show();
    //     this.service
    //       .deleteInBoundCheck(id,user)
    //       .pipe(catchError((err) => of(this.showError(err))))
    //       .subscribe((result) => {
    //         if (result.status == true) {
    //           this.showSuccess(result.messageContent);
    //           this.loadTableData();
    //         } else {
    //           this.spinner.hide();
    //           Swal.fire('In Check(ICD/Other)', result.messageContent, 'error');
    //         }
    //       });
    //   } else if (response.dismiss === Swal.DismissReason.cancel) {
    //     Swal.close();
    //   }
    // });
  }



  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('In Check(ICD/Other)', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('In Check(ICD/Other)', error.statusText, 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport({
        fileName:'InCheckICDOReport.xlsx',
     });
    }
    if (args.item.id === 'detail') {
      let selectedRecords: any[] = this.grid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        if (args.item.id === 'detail')
          {
            this.router.navigate(["/tms-operation/in-check-doc"], { queryParams: { id: null}});
          }
      }

      else {
        const id = selectedRecords[0].inRegNo;
        const user = localStorage.getItem('currentUser');
        if (args.item.id === 'detail')
        {
          this.router.navigate(["/tms-operation/in-check-doc"], { queryParams: { id: id}});
        }
       return;
     }

    }
  }
}
