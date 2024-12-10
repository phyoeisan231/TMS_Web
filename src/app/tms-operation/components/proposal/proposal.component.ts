import { Component, ViewChild } from '@angular/core';
import { TmsOperationModule } from '../../tms-operation.module';
import { DialogEditEventArgs, EditSettingsModel, GridComponent, GridLine, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, debounceTime, of, Subject, switchMap } from 'rxjs';
import { ProposalService } from './proposal.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Dialog } from '@syncfusion/ej2-angular-popups';
import { HttpErrorResponse } from '@angular/common/http';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-proposal',
  standalone: true,
  imports: [TmsOperationModule],
  templateUrl: './proposal.component.html',
  styleUrl: './proposal.component.scss'
})
export class ProposalComponent {
  pageSettings: PageSettingsModel = { pageSize: 50 };
  editSettings: EditSettingsModel = { allowEditing: false, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = ['Add',
  { text: "Details", tooltipText: "Details", prefixIcon: "e-icons e-paste", id: "detail" },
  'Delete','ExcelExport','Search'];
  lines: GridLine = 'Both';

  optionForm: FormGroup;
  submitClicked: boolean = false;
  public formatfilter: any ="MM/dd/yyyy";
  deptTypeList:any[]=["CCA","Warehouse","Rail"];
  today : Date = new Date();
  public data: Object[];
  public placeholder: string = 'Select One';
  public mode?: string;
  public selectAllText: string| any;
  @ViewChild('Grid') public grid: GridComponent;
  constructor(
    private service: ProposalService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {}

  ngOnInit(){
    // set the type of mode for checkbox to visualized the checkbox added in li element.
    this.mode = 'CheckBox';
    // set the select all text to MultiSelect checkbox label.
    this.selectAllText= 'Select All';
    //this.getLocationList();
    this.optionForm = new FormGroup({
      fromDate: new FormControl(sessionStorage.getItem("icfromDate")?sessionStorage.getItem("icfromDate"):this.today,Validators.required),
      toDate: new FormControl(sessionStorage.getItem("ictoDate")?sessionStorage.getItem("ictoDate"):this.today,Validators.required),
      deptType: new FormControl(sessionStorage.getItem("deptType")?sessionStorage.getItem("deptType").split(','):null,Validators.required),
    });

  }

  loadTableData() {
   this.spinner.show();
   const formData = this.optionForm.value;
   const fromDate = moment(formData.fromDate).format('MM/DD/YYYY');
   const toDate =  moment(formData.toDate).format('MM/DD/YYYY');
    sessionStorage.setItem("icfromDate", fromDate);
    sessionStorage.setItem("ictoDate", toDate);
    sessionStorage.setItem("deptType", formData.deptType);
    this.service.getProposalList(fromDate,toDate,formData.deptType)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.grid.dataSource= result;
        this.spinner.hide();
    });
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
        this.submitClicked = false;
        this.router.navigate(["/tms-operation/proposal-form"]);
    }
    else if(args.requestType === 'beginEdit') {
      this.submitClicked = false;
      //this.proposalForm = this.createFormGroup(args.rowData);
   }

    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].inRegNo;
      const status = data[0].status;
      const user = localStorage.getItem('currentUser');
      if(!status){
        this.deleteInBoundCheck(id,user);
      }
      else{
        Swal.fire('TMS Proposal', 'Data can not delete!', 'error');
      }
    }
  }

  formatParams(paramArray) {
    return paramArray.map(item => `'${item}'`).join(',');
  }


  addOutBoundCheck(formData: any) {
    this.spinner.show();
    formData.outCheckDateTime = moment(formData.outCheckDateTime).format('MM/DD/YYYY HH:mm:ss');
    this.service
      .createOutBoundCheck(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result.status == true) {
          this.router.navigate(["/tms-operation/inbound-check-doc"], { queryParams: { id: result.messageContent}});
        } else {
          this.spinner.hide();
          Swal.fire('In Check(ICD/Other)', result.messageContent, 'error');
        }
      });
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
              Swal.fire('TMS Proposal', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  // validateControl(controlName: string) {
  //   const control = this.proposalForm.get(controlName);
  //   return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  // }


  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('TMS Proposal', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('TMS Proposal', error.statusText, 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport({
        fileName:'Proposal.xlsx',
     });
    }
    if (args.item.id === 'detail') {
      let selectedRecords: any[] = this.grid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        Swal.fire('TMS Proposal', "Please select one row!", 'warning');
      }

      else {
        const id = selectedRecords[0].inRegNo;
        const user = localStorage.getItem('currentUser');
        if (args.item.id === 'detail')
        {
          this.router.navigate(["/tms-operation/proposal-detail"], { queryParams: { id: id}});
        }
        return;
      }

    }
  }
}
