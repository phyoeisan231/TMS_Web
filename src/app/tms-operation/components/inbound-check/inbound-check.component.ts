import { Component, ViewChild } from '@angular/core';
import { TmsOperationModule } from '../../tms-operation.module';
import Swal from 'sweetalert2';
import { DialogEditEventArgs, EditSettingsModel, GridComponent, GridLine, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { addDays } from '@syncfusion/ej2/schedule';
import { Dialog, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { InboundCheckService } from './inbound-check.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { catchError, debounceTime, of, Subject, switchMap } from 'rxjs';
import moment from 'moment';
import { Browser, EmitType } from '@syncfusion/ej2/base';
import { HttpErrorResponse } from '@angular/common/http';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';

@Component({
  selector: 'app-inbound-check',
  standalone: true,
  imports: [TmsOperationModule],
  templateUrl: './inbound-check.component.html',
  styleUrl: './inbound-check.component.scss'
})
export class InboundCheckComponent {
  pageSettings: PageSettingsModel = { pageSize: 50 };
  editSettings: EditSettingsModel = { allowEditing: false, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = ['Add',
  { text: "Details", tooltipText: "Details", prefixIcon: "e-icons e-paste", id: "detail" },
  { text: "Add Card Info", tooltipText: "Add Card Info", prefixIcon: "e-circle-add", id: "card" },
  'Delete','ExcelExport','Search'];
  lines: GridLine = 'Both';

  optionForm: FormGroup;
  gateForm: FormGroup;
  submitClicked: boolean = false;
  public formatfilter: any ="MM/dd/yyyy";
  public format: any ="dd/MM/yyyy h:mm a";
  typeList: any[]=['FCL','LCL'];
  statusList: any[]=['Check(In)','In'];
  yardList:any[]=[];
  gateList:any[]=[];
  truckList:any[]=[];
  driverList:any[]=[];
  interval: number =1;
  endDate : Date = new Date();
  //startDate : Date = addDays(this.endDate,-7);
  today : Date = new Date();
  public data: Object[];
  // set placeholder to MultiSelect input element
  public placeholder: string = 'Select One';
  public mode?: string;
  public selectAllText: string| any;
  private searchTruckTerms = new Subject<string>();
  private searchDriverTerms = new Subject<string>();
  @ViewChild('Grid') public grid: GridComponent;
  @ViewChild('cardModel') cardModel: DialogComponent;
   // end multi file upload
  constructor(
    private service: InboundCheckService,
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
      status: new FormControl(sessionStorage.getItem("icstatus")?sessionStorage.getItem("icstatus").split(','):null, Validators.required),
      fromDate: new FormControl(sessionStorage.getItem("icfromDate")?sessionStorage.getItem("icfromDate"):this.today,Validators.required),
      toDate: new FormControl(sessionStorage.getItem("ictoDate")?sessionStorage.getItem("ictoDate"):this.today,Validators.required),
      yardID: new FormControl(sessionStorage.getItem("icloc")?sessionStorage.getItem("icloc").split(','):null,Validators.required),
    });

    // this.editRemarkForm = new FormGroup({
    //   poNo: new FormControl(''),
    //   remark: new FormControl('', Validators.required),
    //   updatedUser: new FormControl(''),
    // });
    this.searchTruckTerms.pipe(
      debounceTime(300),
      switchMap((term: string) => this.service.getTruckList(term))
    ).subscribe(data => {
      this.truckList  = data;
    });

    this.searchDriverTerms.pipe(
      debounceTime(300),
      switchMap((term: string) => this.service.getDriverList(term))
    ).subscribe(data => {
      this.driverList  = data;
    });
  }


  public onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {

  }

  onTruckFiltering(e: any) {
    if (e.text) {
      this.searchTruckTerms.next(e.text);
    }
  }

  getLocationList() {
    this.spinner.show();
    this.service.getYardList('true')
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.yardList = result;
        this.optionForm.controls['yardID'].setValue(sessionStorage.getItem("loc")?sessionStorage.getItem("icloc").split(','):null);
        this.spinner.hide();
    });
  }

  loadTableData() {
   this.spinner.show();
   const formData = this.optionForm.value;
   const fromDate = moment(formData.fromDate).format('MM/DD/YYYY');
   const toDate =  moment(formData.toDate).format('MM/DD/YYYY');
   let status:any ="";
   if(formData.status.length>0){
    status = this.formatParams(formData.status);
   }
   let loc:any ="";
   if(formData.yardID.length>0){
    loc = this.formatParams(formData.yardID);
   }

    sessionStorage.setItem("icfromDate", fromDate);
    sessionStorage.setItem("ictoDate", toDate);
    sessionStorage.setItem("icstatus", formData.status);
    sessionStorage.setItem("icloc", formData.yardID);
    this.service.getInBoundCheckList(fromDate,toDate,loc,status)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.grid.dataSource= result;
        this.spinner.hide();
    });
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
        this.submitClicked = false;
        this.gateForm = this.createFormGroup(args.rowData);
    }
    else if(args.requestType === 'beginEdit') {
      this.submitClicked = false;
      this.gateForm = this.createFormGroup(args.rowData);
  }
    if (args.requestType === 'save') {
        this.submitClicked = true;
        if (this.gateForm.valid) {
            let formData = this.gateForm.value;
            if (args.action === 'add') {
              // formData.poNo =0;
              formData.createdUser = localStorage.getItem('currentUser');
              this.addInBoundCheck(formData);
            }
        } else {
            args.cancel = true;
        }
    }
    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].poNo;
      const status = data[0].status;
      if(status==='Check(In)'){
        this.deleteInBoundCheck(id);
      }
      else{
        Swal.fire('Gate In(Check)', 'Data can not delete!', 'error');
      }
    }
  }

  formatParams(paramArray) {
    return paramArray.map(item => `'${item}'`).join(',');
  }

  actionComplete(args: DialogEditEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      args.dialog.width = 700;
      if(args.requestType === 'add'){
        args!.dialog!.header="New Gate In(Check)" ;
        }
        if (Browser.isDevice) {
            args!.dialog!.height = window.innerHeight - 90 + 'px';
            (<Dialog>args.dialog).dataBind();
        }
    }
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      inRegNo: new FormControl(data.inRegNo),
      inCheckDateTime: new FormControl(this.today, Validators.required),
      inGateID: new FormControl(data.inGateID,Validators.required),
      inYardID: new FormControl(data.inYardID,Validators.required),
      inPCCode: new FormControl(data.inPCCode,Validators.required),
      truckVehicleRegNo: new FormControl(data.truckVehicleRegNo,Validators.required),
      driverLicenseNo: new FormControl(data.truckVehicleRegNo,Validators.required),
      driverName: new FormControl(data.driverName),
    });
  }

  addInBoundCheck(formData: any) {
    this.spinner.show();
    formData.inCheckDateTime = moment(formData.inCheckDateTime).format('MM/DD/YYYY HH:mm:ss');
    this.service
      .createInBoundCheck(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result.status == true) {
          this.router.navigate(["/tms-operation/inbound-check-doc"], { queryParams: { id: result.messageContent}});
        } else {
          this.spinner.hide();
          Swal.fire('Gate In(Check)', result.messageContent, 'error');
        }
      });
  }


  deleteInBoundCheck(id: any) {
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
          .deleteInBoundCheck(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
              Swal.fire('Gate In(Check)', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  validateControl(controlName: string) {
    const control = this.gateForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }


  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('Gate In(Check)', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Gate In(Check)', error.statusText, 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport();
    }
    if (args.item.id === 'detail') {
      let selectedRecords: any[] = this.grid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        Swal.fire('Purchase Order', "Please select one row!", 'warning');
      }

      else {
        const id = selectedRecords[0].inRegNo;
        const user = localStorage.getItem('currentUser');
        if (args.item.id === 'detail')
        {
          this.router.navigate(["/tms-operation/inbound-check-doc"], { queryParams: { id: id}});
        }
        return;
      }

    }
  }
}
