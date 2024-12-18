import { Component, ViewChild } from '@angular/core';
import { TmsOperationModule } from '../../tms-operation.module';
import { EditSettingsModel, GridComponent, GridLine, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { TmsInCheckPorposalService } from '../tms-in-check-proposal/tms-in-check-proposal.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import moment from 'moment';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-tms-in-check',
  standalone: true,
  imports: [TmsOperationModule],
  templateUrl: './tms-in-check.component.html',
  styleUrl: './tms-in-check.component.scss'
})

export class TmsInCheckComponent {
 pageSettings: PageSettingsModel = { pageSize: 50 };
  editSettings: EditSettingsModel = { allowEditing: false, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = [{ text: "Detail", tooltipText: "Detail", prefixIcon: "e-icons e-selection", id: "detail" },
  'Delete','ExcelExport','Search'];
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
    private service: TmsInCheckPorposalService,
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
      fromDate: new FormControl(sessionStorage.getItem("icfromDate")?sessionStorage.getItem("icfromDate"):this.today,Validators.required),
      toDate: new FormControl(sessionStorage.getItem("ictoDate")?sessionStorage.getItem("ictoDate"):this.today,Validators.required),
      yardID: new FormControl(sessionStorage.getItem("icloc")?sessionStorage.getItem("icloc"):null,Validators.required),
      // yardID: new FormControl(sessionStorage.getItem("icloc")?sessionStorage.getItem("icloc").split(','):null,Validators.required),
    });
  }

  getLocationList() {
    this.spinner.show();
    this.service.getYardList('true')
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.yardList = result;
        this.optionForm.controls['yardID'].setValue(sessionStorage.getItem("icloc")?sessionStorage.getItem("icloc"):null);
        this.spinner.hide();
    });
  }


  loadTableData() {
   this.spinner.show();
   const formData = this.optionForm.value;
   const fromDate = moment(formData.fromDate).format('MM/DD/YYYY');
   const toDate =  moment(formData.toDate).format('MM/DD/YYYY');
  //  let loc:any ="";
  //  if(formData.yardID.length>0){
  //   loc = this.formatParams(formData.yardID);
  //  }
    sessionStorage.setItem("icfromDate", fromDate);
    sessionStorage.setItem("ictoDate", toDate);
    sessionStorage.setItem("icloc", formData.yardID);
    this.service.getInBoundCheckTMSList(fromDate,toDate,formData.yardID)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.grid.dataSource= result;
        this.grid.searchSettings.operator = "equal";
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

  deleteInBoundCheck(id: any,user:string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      cancelButtonText: 'No, keep it',
      confirmButtonText: 'Yes, I am sure!',
    }).then((response: any) => {
      if (response.value) {
        this.spinner.show();
        this.service
          .deleteInBoundCheck(id,user)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
              Swal.fire('In Check(TMS)', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }



  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('In Check(TMS)', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('In Check(TMS)', error.statusText, 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport({
        fileName:'InCheckTMSReport.xlsx',
     });
    }
    if (args.item.id === 'detail') {
      let selectedRecords: any[] = this.grid.getSelectedRecords();
      if (selectedRecords.length == 0) {
         Swal.fire('In Check(TMS)', "Please select one row!", 'warning');
      }

      else {
        const id = selectedRecords[0].inRegNo;
        const poNo = selectedRecords[0].propNo;
        if (args.item.id === 'detail')
        {
          this.router.navigate(["/tms-operation/tms-in-check-proposal-doc"], { queryParams: { poNo: poNo, id: id}});
        }
       return;
     }

    }
  }
}
