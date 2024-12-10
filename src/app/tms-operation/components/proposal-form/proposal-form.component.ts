import { Component, ViewChild } from '@angular/core';
import { ProposalService } from '../proposal/proposal.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { TmsOperationModule } from '../../tms-operation.module';
import moment from 'moment';
import { GridComponent, GridLine, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { EditSettingsModel } from '@syncfusion/ej2/treegrid';

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
  cardForm:any;
  detailData:any;
  cargoTypeList:any[]=['Laden','MT'];
  typeList:string[]=['FCL','LCL'];
  yardList:any[]=[];
  gateList:any[]=[];
  wbList:any[]=[];
  truckList:any[]=[];
  trailerList:any[]=[];
  driverList:any[]=[];
  transporterList:any[]=[];
  areaList:any[]=[];
  pcCodeList:any[]=[];
  docList:any[]=[];
  cardList:any[]=[];
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
    customerName:new FormControl('',Validators.required),
    companyName:new FormControl(''),
    cargoInfo:new FormControl(''),
    });

    this.cardForm = new FormGroup({
    inRegNo: new FormControl(''),
    cardNo: new FormControl('', Validators.required),
    inWeightBridgeID: new FormControl(''),
    outWeightBridgeID: new FormControl(''),
    });
    this.getLocationList();
    this.getCustomerList();

  }

  getLocationList() {
    this.spinner.show();
    this.service.getYardList('true')
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.yardList = result;
        this.spinner.hide();
    });
  }

  getCustomerList(){
    this.spinner.show();
    this.service.getCustomerList()
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.customerList = result;
        this.spinner.hide();
    });
  }

  onjobDeptChange(id:string){
    if(id=="Rail"){
      this.jobTypeList=[];
      this.jobTypeList=["Pick Up","Receive BC","Receive GC","Receive SC","Delivery","Issue BC","Issue GC","Issue SC"]
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
    const jDept=formData.jobDept;
    this.yard=formData.yard;
    if(jDept=="Rail"){
     this.service.getRailDailyJobList(sDate,jobType,this.yard)
     .pipe(catchError((err) => of(this.showError(err))))
       .subscribe((result) => {
         this.jobIdList=[];
         this.jobIdList = result;
     });
    }
    else if(jDept=="Warehouse"){
      this.service.getWHDailyJobList(sDate,jobType)
      .pipe(catchError((err) => of(this.showError(err))))
        .subscribe((result) => {
          this.jobIdList=[];
          this.jobIdList = result;
      });
    }
    else{
      this.service.getCCADailyJobList(sDate,jobType)
      .pipe(catchError((err) => of(this.showError(err))))
        .subscribe((result) => {
          this.jobIdList=[];
          this.jobIdList = result;
      });
    }

    }

    onJobCodeChange(code: string) {
      const newJobCodeList=this.jobIdList.filter(i=>i.jobCode==code);
      if(newJobCodeList[0].customerId){
        this.proposalForm.controls['customerId'].setValue(newJobCodeList[0].customerId);
        const cusName=this.customerList.filter(c=>c.customerId==newJobCodeList[0].customerId);
        this.proposalForm.controls['customerName'].setValue(cusName[0].name);
        this.proposalForm.controls['companyName'].setValue(cusName[0].groupName);
      }

    }


  rowDataBound(args: any): void {
    if (args.row) {
      //args.isSelectable = args.data.status === 'Draft';
      if (args.data.checkStatus) {
        (args.row as Element).classList.add('bluegreen');
      }
     }
   }

  getInBoundCheckById(){
    this.spinner.show();
    this.service.getInBoundCheckById(this.id)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.docList=result.documentList;
        this.detailData = result;

        for (let key in this.detailData) {
          if ( this.detailData.hasOwnProperty(key) && this.detailData[key] != null &&  this.proposalForm.controls[key]) {
            if (key != 'documentList') {
              this.proposalForm.controls[key].setValue(this.detailData[key]);
            }
          }
         }
        });
        this.spinner.hide();
  }

  onFormAssignCard(){
    const formData=this.proposalForm.value;
    const cardForm = this.cardForm.value;
    formData.cardNo = cardForm.cardNo;
    formData.inWeightBridgeID = cardForm.inWeightBridgeID;
    formData.outWeightBridgeID = cardForm.outWeightBridgeID;
    formData.documentList = this.docList;
    formData.inRegNo=0;
    formData.createdUser = localStorage.getItem('currentUser');
    if(this.transporterList){
      const transporter = this.transporterList.filter(x=>x.transporterID==formData.transporterID);
      if(transporter.length>0){
        formData.transporterName = transporter[0].transporterName;
      }
    }
    if(this.driverList.length>0){
      const driver = this.driverList.filter(x=>x.licenseNo==formData.driverLicenseNo);
      if(driver.length>0){
        formData.driverName = driver[0].name;
        formData.driverContactNo = driver[0].contactNo;
      }
    }
    if(this.isInWb){
      if(!cardForm.inWeightBridgeID){
        Swal.fire('In Check Document', 'Please add In Weight Bridge.', 'warning');
        return;
      }
    }
    if(this.isOutWb){
      if(!cardForm.outWeightBridgeID){
        Swal.fire('In Check Document', 'Please add Out Weight Bridge.', 'warning');
        return;
      }
    }
      console.log(formData);
      this.createInBoundCheck(formData);
  }

  onFormSubmit(){
   this.spinner.show();
   const formData=this.proposalForm.value;
   formData.propNo=1;
   this.addTMSProposal(formData);
  }

  addTMSProposal(formData:any){
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

  onBackSubmit(){
    this.router.navigate(["/tms-operation/in-check"]);
  }

  createInBoundCheck(formData: any) {
    this.spinner.show();
    this.service
    .createOutBoundCheck(formData)
    .pipe(catchError((err) => of(this.showError(err))))
    .subscribe((result) => {
      if (result.status == true) {
        this.showSuccess(result.messageContent);
        this.router.navigate(["/tms-operation/in-check"]);
      } else {
        this.spinner.hide();
        Swal.fire('In Check Document', result.messageContent, 'error');
      }
    });
  }

    onTruckChange(id:string){
     const truck = this.truckList.filter(x=>x.vehicleRegNo==id);
     if(this.driverList){
      const driver = this.driverList.filter(x=>x.licenseNo==truck[0].driverLicenseNo);
      if(driver.length>0){
        this.proposalForm.controls['driverLicenseNo'].setValue(truck[0].driverLicenseNo?truck[0].driverLicenseNo:null);
      }
     }
      this.proposalForm.controls['transporterID'].setValue(truck[0].transporterID?truck[0].transporterID:null);
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

  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'check') {
      let selectedRecords: any[] = this.grid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        Swal.fire('Check Document', "Please select one row!", 'warning');
      }
      else {
        if (args.item.id === 'check')
        {
          for(var i=0;i<selectedRecords.length;i++){
            this.docList = this.docList.map((x) => {
              if (x.docCode === selectedRecords[i].docCode) {
                  return { ...x, docCode:  selectedRecords[i].docCode,docName: selectedRecords[i].docName,checkStatus: true};//update data
              } else {
                  return x; // Keep other objects unchanged
             }
             });
           }
        }
        return;
      }
    }
  }
}
