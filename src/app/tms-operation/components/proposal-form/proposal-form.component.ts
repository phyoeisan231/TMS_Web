import { Component, ViewChild } from '@angular/core';
import { ProposalService } from '../proposal/proposal.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { TmsOperationModule } from '../../tms-operation.module';
import moment from 'moment';
import { EditSettingsModel, PageSettingsModel } from '@syncfusion/ej2/treegrid';
import { GridComponent, GridLine } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-proposal-form',
  standalone: true,
  imports: [TmsOperationModule],
  templateUrl: './proposal-form.component.html',
  styleUrl: './proposal-form.component.scss'
})
export class ProposalFormComponent {

  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowEditing: false, allowAdding: false, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = [{ text: "Checked", tooltipText: "Checked", prefixIcon: "e-icons e-check", id: "check" },'Search'];
  lines: GridLine = 'Both';
  submitClicked:boolean=false;
  proposalForm:any;
  public format1='dd-MMM-yy hh:mm a';
  id:any;
  yardList:any[]=[];
  truckTypeList:any[]=['RG','Customer','Supplier'];
  endDate : Date = new Date();
  type:string;
  isInWb:boolean=false;
  isOutWb:boolean=false;
  today : Date = new Date();
  public data: Object[];
  public placeholder: string = 'Select One';
  public filterPlaceholder: string = 'Search';

  jobDeptList:any[]=["CCA","Rail","Warehouse"];
  jobTypeList:any[]=[];
  jobIdList:any[]=[];
  customerList:any[]=[];
  sDate:Date;
  yard:string;
  proposalList:any[]=[];
  jDept:string;

  @ViewChild('Grid') public grid: GridComponent;
  constructor(
    private service: ProposalService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,

  ) {}

  ngOnInit(){
    this.id = this.route.snapshot.queryParams['id'];
    this.proposalForm = new FormGroup({
    propNo:new FormControl(''),
    yard: new FormControl('',Validators.required),
    estDate: new FormControl(this.today, Validators.required),
    jobDept: new FormControl('',Validators.required),
    jobType: new FormControl('',Validators.required),
    jobCode: new FormControl('',Validators.required),
    noOfTEU: new FormControl(''),
    noOfFEU: new FormControl(''),
    lclQty: new FormControl(''),
    customerId:new FormControl('',Validators.required),
    customerName:new FormControl(''),
    companyName:new FormControl(''),
    cargoInfo:new FormControl(''),
    noOfTruck: new FormControl('',Validators.required)
    });


    if(this.id){
      this.getProposalList(this.id);
    }

    this.getLocationList();
    //this.getCustomerList();
  }

  getProposalList(id:string){
    this.spinner.show();
    this.service.getProposalListById(id)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.proposalForm.controls['propNo'].setValue(result[0].propNo);
        this.proposalForm.controls["yard"].setValue(result[0].yard);
        this.proposalForm.controls["jobDept"].setValue(result[0].jobDept);
        this.onjobDeptChange(result[0].jobDept)
        this.proposalForm.controls["jobType"].setValue(result[0].jobType);
        this.onJobTypeChange(result[0].jobType)
        this.proposalForm.controls["customerId"].setValue(result[0].customer);
        this.proposalForm.controls['jobCode'].setValue(result[0].jobCode);
        this.proposalForm.controls["noOfTruck"].setValue(result[0].noOfTruck);
        this.proposalForm.controls["noOfTEU"].setValue(result[0].noOfTEU);
        this.proposalForm.controls["noOfFEU"].setValue(result[0].noOfFEU);
        this.proposalForm.controls["lclQty"].setValue(result[0].lclQty);
        this.proposalForm.controls["cargoInfo"].setValue(result[0].cargoInfo);
        this.spinner.hide();
    });
  }

  getLocationList() {
    this.spinner.show();
    this.service.getYardList()
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.yardList = result;
        this.spinner.hide();
    });
  }

  // getCustomerList(){
  //   this.spinner.show();
  //   this.service.getCustomerList()
  //   .pipe(catchError((err) => of(this.showError(err))))
  //     .subscribe((result) => {
  //       this.customerList = result;
  //       this.spinner.hide();
  //   });
  // }

  // getJobCodeList(id:string,){
  //   this.spinner.show();
  //   this.service.getJobCodeList(id)
  //   .pipe(catchError((err) => of(this.showError(err))))
  //     .subscribe((result) => {
  //       this.customerList = result;
  //       this.spinner.hide();
  //   });
  // }

  onjobDeptChange(id:string){
    this.jDept=id;
    if(id=="Rail"){
      this.jobTypeList=[];
      this.jobTypeList=["Pickup","Receive BC","Receive GC","Receive SC","Delivery","Issue BC","Issue GC","Issue SC"]
    }
    else if(id=="Warehouse"){

      this.jobTypeList=[];
      this.jobTypeList=["Inbound","Outbound"];
    }
    else{
      this.jobTypeList=[];
      this.jobTypeList=["Import","Ex Bond","Export","Into Bond"];
    }
   }


   onJobTypeChange(jobType:string){
    let formData=this.proposalForm.value;
    const sDate=moment(formData.estDate).format('MM/DD/YYYY');
    this.yard=formData.yard;
    if(this.jDept=="Rail"){
     this.service.getRailDailyJobList(jobType,this.yard)
     .pipe(catchError((err) => of(this.showError(err))))
       .subscribe((result) => {
         this.customerList=[];
         this.customerList = result;
     });
    }
    else if(this.jDept=="Warehouse"){
      this.service.getWHDailyJobList(jobType,this.yard)
      .pipe(catchError((err) => of(this.showError(err))))
        .subscribe((result) => {
          this.customerList=[];
          this.customerList = result;
      });
    }
    else{
      this.service.getCCADailyJobList(jobType,this.yard)
      .pipe(catchError((err) => of(this.showError(err))))
        .subscribe((result) => {
          this.customerList=[];
          this.customerList = result;
      });
    }
    }

    onCustomerChange(customer:string){
      const cusList=this.customerList.filter(i=>i.customerId==customer);
      this.proposalForm.controls['customerName'].setValue(cusList[0].name);
      this.jobIdList=cusList;
      //this.getJobCodeList(customer);
    }

    onJobCodeChange(code: string) {
      const newJobCodeList=this.jobIdList.filter(i=>i.jobCode==code);
      this.proposalForm.controls['noOfTEU'].setValue(newJobCodeList[0].noOfTEU);
      this.proposalForm.controls['noOfFEU'].setValue(newJobCodeList[0].noOfFEU);
      this.proposalForm.controls['lclQty'].setValue(newJobCodeList[0].lclQty);
      this.proposalForm.controls['cargoInfo'].setValue(newJobCodeList[0].remark);
      // if(newJobCodeList[0].customerId){
      //   this.proposalForm.controls['customerId'].setValue(newJobCodeList[0].customerId);
      //   const cusName=this.customerList.filter(c=>c.customerId==newJobCodeList[0].customerId);
      //   this.proposalForm.controls['customerName'].setValue(cusName[0].name);
      //   this.proposalForm.controls['companyName'].setValue(cusName[0].groupName);
      // }
    }


  rowDataBound(args: any): void {
    if (args.row) {
      //args.isSelectable = args.data.status === 'Draft';
      if (args.data.checkStatus) {
        (args.row as Element).classList.add('bluegreen');
      }
     }
   }

  onFormSubmit(){
   this.spinner.show();
   const formData=this.proposalForm.value;
   if(formData.propNo!=0){
    this.updateTMSproposal(formData);
   }
   else {
    this.addTMSProposal(formData);
   }
  }

  addTMSProposal(formData:any){
    formData.propNo=0;
    formData.createdUser=localStorage.getItem('currentUser');
    this.service.addTMSProposal(formData)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result.status == true) {
          this.showSuccess(result.messageContent);
          this.router.navigate(["/tms-operation/proposal"]);
        } else {
          this.spinner.hide();
          Swal.fire('Proposal', result.messageContent, 'error');
        }
    });
  }

  updateTMSproposal(formData){
    formData.updatedUser=localStorage.getItem('currentUser');
    this.service.updateTMSProposal(formData)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result.status == true) {
          this.showSuccess(result.messageContent);
          this.router.navigate(["/tms-operation/proposal"]);
        } else {
          this.spinner.hide();
          Swal.fire('Proposal', result.messageContent, 'error');
        }
    });
  }

  onBackSubmit(){
    this.router.navigate(["/tms-operation/in-check"]);
  }

  showError(error:HttpErrorResponse){
    this.spinner.hide();
    Swal.fire('TMS Proposal',error.statusText,'error');
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('TMS Proposal', msg, 'success');
  }

  validateControl(controlName: string) {
    const control = this.proposalForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }
}
