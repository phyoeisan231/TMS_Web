import { Component, ViewChild } from '@angular/core';
import { TmsOperationModule } from '../../tms-operation.module';
import Swal from 'sweetalert2';
import { DialogEditEventArgs, EditSettingsModel, GridComponent, GridLine, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { FormControl, FormGroup,Validators } from '@angular/forms';
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
  'Delete','ExcelExport','Search'];
  lines: GridLine = 'Both';

  optionForm: FormGroup;
  gateForm: FormGroup;
  submitClicked: boolean = false;
  public formatfilter: any ="MM/dd/yyyy";
  yardList:any[]=[];
  gateList:any[]=[];
  truckList:any[]=[];
  trailerList:any[]=[];
  driverList:any[]=[];
  transporterList:any[]=[];
  areaList:any[]=[];
  pcCodeList:any[]=[];
  containerTypeList:any[]=['Laden','Empty'];
  containerSize:any[]=['20','40','45'];
  truckTypeList:any[]=['RG','Customer','Supplier'];
  typeList: any[]=['FCL','LCL'];
  interval: number =1;
  endDate : Date = new Date();
  type:string;
  today : Date = new Date();
  public data: Object[];
  public placeholder: string = 'Select One';
  public mode?: string;
  public selectAllText: string| any;
  private searchTruckTerms = new Subject<string>();
  private searchDriverTerms = new Subject<string>();
  @ViewChild('Grid') public grid: GridComponent;
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
      fromDate: new FormControl(sessionStorage.getItem("icfromDate")?sessionStorage.getItem("icfromDate"):this.today,Validators.required),
      toDate: new FormControl(sessionStorage.getItem("ictoDate")?sessionStorage.getItem("ictoDate"):this.today,Validators.required),
      yardID: new FormControl(sessionStorage.getItem("icloc")?sessionStorage.getItem("icloc").split(','):null,Validators.required),
    });
    this.getCategoryList();
    this.getTransporterList();

    this.searchTruckTerms.pipe(
      debounceTime(300),
      switchMap((term: string) => this.service.getTruckList(term,this.type))
    ).subscribe(data => {
      if(this.type){
        this.truckList  = data;
      }
      else{
        this.truckList =[];
      }
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
    if (e.text && this.type) {
      this.searchTruckTerms.next(e.text);
    }
  }

  onDriverFiltering(e: any) {
    if (e.text) {
      this.searchDriverTerms.next(e.text);
    }
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

  getGateList(yard:string){
    this.spinner.show();
    this.service.getGateList(yard)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.gateList  = result;
        this.spinner.hide();
    });
  }

  getAreaList(yard:string){
    this.spinner.show();
    this.service.getAreaList(yard)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.areaList  = result;
        this.spinner.hide();
    });
  }

  getCategoryList(){
     this.service.getCategoryList('true')
     .pipe(catchError((err) => of(this.showError(err))))
       .subscribe((result) => {
         this.pcCodeList = result;
         this.spinner.hide();
     });
  }

  getTransporterList(){
    this.service.getTransporterList()
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.transporterList = result;
        this.spinner.hide();
    });
 }


  onYardChange(code: string) {
   this.getGateList(code);
   this.getAreaList(code);
  }

  onTruckTypeChange(code: string) {
    this.type = code;
    this.truckList =[];
   }

   onTruckChange(id:string){
    const truck = this.truckList.filter(x=>x.vehicleRegNo==id);
    this.gateForm.controls['driverLicenseNo'].setValue(truck[0].driverLicenseNo?truck[0].driverLicenseNo:'');
    this.gateForm.controls['transporterID'].setValue(truck[0].transporterID?truck[0].transporterID:'');
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
    sessionStorage.setItem("icfromDate", fromDate);
    sessionStorage.setItem("ictoDate", toDate);
    sessionStorage.setItem("icloc", formData.yardID);
    this.service.getInBoundCheckList(fromDate,toDate,loc)
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
              formData.inRegNo =0;
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
      const id = data[0].inRegNo;
      const status = data[0].status;
      const user = localStorage.getItem('currentUser');
      if(!status){
        this.deleteInBoundCheck(id,user);
      }
      else{
        Swal.fire('In Check(ICD/Other)', 'Data can not delete!', 'error');
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
        args!.dialog!.header="New In Check" ;
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
      driverLicenseNo: new FormControl(data.driverLicenseNo),
      areaID: new FormControl(data.areaID,Validators.required),
      driverName: new FormControl(data.driverName),
      transporterID: new FormControl(data.transporterID),
      transporterName: new FormControl(data.transporterName),
      truckType:new FormControl(data.truckType,Validators.required),
      customer:new FormControl(data.customer,Validators.required),
      trailerVehicleRegNo:new FormControl(data.trailerVehicleRegNo),
    });
  }

  addInBoundCheck(formData: any) {
    this.spinner.show();
    const driver = this.driverList.filter(x=>x.licenseNo==formData.driverLicenseNo);
    formData.driverName = driver[0].name;
    const truck = this.truckList.filter(x=>x.vehicleRegNo==formData.truckVehicleRegNo);
    formData.inContainerType = truck[0].containerType;
    formData.inContainerSize = truck[0].containerSize;
    if(this.transporterList){
      const transporter = this.transporterList.filter(x=>x.transporterID==formData.transporterID);
      if(transporter){
        formData.transporterName = transporter[0].transporterName;
      }
    }
    console.log(formData);
    formData.inCheckDateTime = moment(formData.inCheckDateTime).format('MM/DD/YYYY HH:mm:ss');
    this.service
      .createInBoundCheck(formData)
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
              Swal.fire('In Check(ICD/Other)', result.messageContent, 'error');
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
    Swal.fire('In Check(ICD/Other)', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('In Check(ICD/Other)', error.statusText, 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport({
        fileName:'InCheckICDOtherReport.xlsx',
     });
    }
    if (args.item.id === 'detail') {
      let selectedRecords: any[] = this.grid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        Swal.fire('In Check(ICD/Other)', "Please select one row!", 'warning');
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
