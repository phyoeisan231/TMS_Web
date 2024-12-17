import { Component, ViewChild } from '@angular/core';
import { TmsOperationModule } from '../../tms-operation.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, of,  } from 'rxjs';
import { ProposalService } from './proposal.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import moment from 'moment';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EditSettingsModel, GridComponent, GridLine, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-proposal',
  standalone: true,
  imports: [TmsOperationModule],
  templateUrl: './proposal.component.html',
  styleUrl: './proposal.component.scss'
})
export class ProposalComponent {
  pageSettings: PageSettingsModel = { pageSize: 50 };
  editSettings: EditSettingsModel = {  allowAdding: true, allowDeleting: true };
  toolbar: any[] = ['Add',
  { text: "Edit", tooltipText: "Edit", prefixIcon: "e-icons e-edit", id: "edit" },
  // { text: "AssignIn", tooltipText: "AssignIn", prefixIcon: "e-icons e-circle-add", id: "assignIn" },
  // { text: "Customer", tooltipText: "Customer", prefixIcon: "e-icons e-circle-add", id: "customer" },
  { text: "Truck Details", tooltipText: "Truck Details", prefixIcon: "e-icons e-selection", id: "detail" },
  'Delete','ExcelExport','Search'];
  lines: GridLine = 'Both';

 // assignInForm:FormGroup;
  optionForm: FormGroup;
 // customerForm:FormGroup;
  submitClicked: boolean = false;
  public formatfilter: any ="MM/dd/yyyy";
  deptTypeList:any[]=["CCA","Warehouse","Rail"];
  today : Date = new Date();
  public data: Object[];
  public placeholder: string = 'Select One';
  public mode?: string;
  public selectAllText: string| any;
  //assignList:any[]=["RGL","Supplier"]
  //truckList:any[]=[];
  jobDept:string;
  jobTypeList:any[]=[];
 // cusTruckList:any[]=[];
  type:string;
  driverList:any[]=[];
  @ViewChild('Grid') public grid: GridComponent;
  @ViewChild('assignModel') assignModel: DialogComponent;
  @ViewChild('customerModel') customerModel: DialogComponent;

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

    // this.assignInForm = new FormGroup({
    //   propNo:new FormControl(''),
    //   jobDept:new FormControl(''),
    //   assignType: new FormControl('',Validators.required),
    //   truckNo: new FormControl('', Validators.required),
    //   driverName: new FormControl('',Validators.required),
    //   driverContact:new FormControl('',Validators.required),
    //   nightStop: new FormControl(''),
    //   otherInfo:new FormControl(''),
    //   jobType:new FormControl('',Validators.required),
    //   truckAssignId: new FormControl(''),
    //   });

    // this.customerForm = new FormGroup({
    //   propNo:new FormControl(''),
    //   jobDept:new FormControl(''),
    //   assignType: new FormControl('',Validators.required),
    //   truckNo: new FormControl('', Validators.required),
    //   driverName: new FormControl('',Validators.required),
    //   driverContact:new FormControl('',Validators.required),
    //   nightStop: new FormControl(''),
    //   otherInfo:new FormControl(''),
    //   jobType:new FormControl('',Validators.required),
    // });

    //this.loadTableData();
   // this.getCusTruckList();
  }

  // getCusTruckList(){
  //   this.service.getCusTruckList()
  //   .pipe(catchError((err) => of(this.showError(err))))
  //     .subscribe((result) => {
  //       this.cusTruckList= result;
  //       this.spinner.hide();
  //   });
  // }

  // getCusDriverList(licenseNo:string){
  //   this.service.getCusDriverList(licenseNo)
  //   .pipe(catchError((err) => of(this.showError(err))))
  //     .subscribe((result) => {
  //       this.driverList= result;
  //       this.customerForm.controls["driverName"].setValue(this.driverList[0].driverName);
  //       this.customerForm.controls["driverContact"].setValue(this.driverList[0].contactNo);
  //       this.spinner.hide();
  //   });
  // }

  loadTableData() {
   this.spinner.show();
   const formData = this.optionForm.value;
   const fromDate = moment(formData.fromDate).format('MM/DD/YYYY');
   const toDate =  moment(formData.toDate).format('MM/DD/YYYY');
    sessionStorage.setItem("icfromDate", fromDate);
    sessionStorage.setItem("ictoDate", toDate);
    sessionStorage.setItem("deptType", formData.deptType);
    let dept:any ="";
    if(formData.deptType.length>0){
      dept = this.formatParams(formData.deptType);
    }
    if(fromDate&&toDate&&dept){
      this.service.getProposalList(fromDate,toDate,dept)
      .pipe(catchError((err) => of(this.showError(err))))
        .subscribe((result) => {
          this.grid.dataSource= result;
          this.spinner.hide();
      });
    }

  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
        this.submitClicked = false;
        this.router.navigate(["/tms-operation/proposal-form"]);
    }
    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].propNo;
      this.deleteProposal(id);
    }
  }

  formatParams(paramArray) {
    return paramArray.map(item => `'${item}'`).join(',');
  }


  deleteProposal(id: any) {
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
          .deleteProposal(id)
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

  // onAssignInSubmit(){
  //   const formData=this.assignInForm.value;
  //   formData.createdUser = localStorage.getItem('currentUser');
  //   this.createProposalDetail(formData);
  // }

  // onCustomerSubmit(){
  //   const formData=this.customerForm.value;
  //   formData.createdUser = localStorage.getItem('currentUser');
  //   this.createProposalDetail(formData);
  // }

  createProposalDetail(formData: any) {
    this.spinner.show();
    this.service
    .createProposalDetail(formData)
    .pipe(catchError((err) => of(this.showError(err))))
    .subscribe((result) => {
      if (result.status == true) {
        this.assignModel.hide();
        this.customerModel.hide();
        this.showSuccess(result.messageContent);
        this.router.navigate(["/tms-operation/proposal"]);
      } else {
        this.spinner.hide();
        Swal.fire('Proposal', result.messageContent, 'error');
      }
    });
  }

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

    if (args.item.id === 'detail' || args.item.id==='edit') {
      let selectedRecords: any[] = this.grid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        Swal.fire('TMS Proposal', "Please select one row!", 'warning');
      }

      else {
        const id = selectedRecords[0].propNo;
        this.jobDept=selectedRecords[0].jobDept;
        const user = localStorage.getItem('currentUser');
        if (args.item.id === 'detail')
        {
          this.router.navigate(["/tms-operation/proposal-detail"], { queryParams: { id: id}});
          return;
        }
        if(args.item.id==='edit'){
          this.router.navigate(["/tms-operation/proposal-form"],{ queryParams: { id: id}});

        }
      }
    }
  }

  onAssignTypeChange(type:string){
  if(type!=null && this.jobDept!=null){
    this.type=type;
    if(this.jobDept=="CCA"){
      this.jobTypeList=[];
      this.jobTypeList=['Import','Export']
    }
    else if(this.jobDept=="Warehouse"){
      this.jobTypeList=[];
      this.jobTypeList=['WH Pick Up','WH Delivery','Bonded Delivery','Bonded Transport','Import','Export']
    }
    else{
      this.jobTypeList=[];
      this.jobTypeList=['Rail Delivery','Rail Pick Up'];
    }
  }
  }

  // onJobTypeChange(jobType:string){
  //   if(this.type==null){
  //     Swal.fire("Proposal","Please Select type!","warning");
  //     return;
  //   }
  //   if(this.type!=null && jobType!=null){
  //    this.service
  //    .getTruckList(this.type,jobType)
  //    .pipe(catchError((err) => of(this.showError(err))))
  //    .subscribe((result) => {
  //     this.truckList=result;
  //   });
  //   }
  // }



  // onCusTruckChange(truckNo:string){
  //   let truckInfo=this.cusTruckList.filter(t=>t.vehicleRegNo==truckNo);
  //   this.getCusDriverList(truckInfo[0].driverLicenseNo);
  // }

  // customerValidateControl(controlName: string) {
  //   const control = this.customerForm.get(controlName);
  //   return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  // }
}
