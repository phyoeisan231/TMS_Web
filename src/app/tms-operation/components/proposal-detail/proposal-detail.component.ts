import { Component, ViewChild } from '@angular/core';
import { EditSettingsModel, ExcelQueryCellInfoEventArgs, GridComponent, GridLine, PageSettingsModel, SaveEventArgs, Toolbar } from '@syncfusion/ej2-angular-grids';
import { ProposalService } from '../proposal/proposal.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { TmsOperationModule } from '../../tms-operation.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-proposal-detail',
  standalone: true,
  imports: [TmsOperationModule],
  templateUrl: './proposal-detail.component.html',
  styleUrl: './proposal-detail.component.scss'
})
export class ProposalDetailComponent {
  pageSettings: PageSettingsModel = { pageSize: 50 };
  editSettings: EditSettingsModel = { allowEditing: false, allowAdding: true, allowDeleting: true };
  toolbar: any[] = [
    { text: "RGLTruck", tooltipText: "RGLTruck", prefixIcon: "e-icons e-circle-add", id: "rglTruck" },
    { text: "CustomerTruck", tooltipText: "CustomerTruck", prefixIcon: "e-icons e-circle-add", id: "customerTruck" },
    'Delete','ExcelExport','Search'];
  lines: GridLine = 'Both';
  public format1='dd-MMM-yy hh:mm a';
  optionForm:FormGroup;
  rglTruckForm:FormGroup;
  customerTruckForm:FormGroup;
  id:string;
  proposalDetailForm:any=[];
  submitClicked: boolean = false;
  assignList:any[]=["RGL","Supplier"];
  truckList:any[]=[];
  jobDept:string;
  jobTypeList:any[]=[];
  cusTruckList:any[]=[];
  type:string;
  propNo:string;
  @ViewChild('Grid') public grid: GridComponent;
  @ViewChild('rglModel') rglModel: DialogComponent;
  @ViewChild('customerModel') customerModel: DialogComponent;
  constructor(
    private service: ProposalService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  ngOnInit(){
    this.id = this.route.snapshot.queryParams['id'];

    this.optionForm = new FormGroup({
      propNo: new FormControl(''),
      yard: new FormControl(''),
      estDate: new FormControl(''),
      jobDept: new FormControl(''),
      jobType:new FormControl(''),
      jobCode:new FormControl(''),
      });

    this.rglTruckForm = new FormGroup({
      propNo:new FormControl(''),
      jobDept:new FormControl(''),
      assignType: new FormControl('',Validators.required),
      truckNo: new FormControl('', Validators.required),
      //driverName: new FormControl(''),
      //driverContact:new FormControl(''),
      nightStop: new FormControl(''),
      otherInfo:new FormControl(''),
      jobType:new FormControl('',Validators.required),
      truckAssignId: new FormControl(''),
    });

    this.customerTruckForm = new FormGroup({
      propNo:new FormControl(''),
      jobDept:new FormControl(''),
      assignType: new FormControl('',Validators.required),
      truckNo: new FormControl('', Validators.required),
      //driverName: new FormControl('',Validators.required),
      //driverContact:new FormControl('',Validators.required),
      nightStop: new FormControl(''),
      otherInfo:new FormControl(''),
      jobType:new FormControl('',Validators.required),
    });

    this.getCusTruckList();

    if(this.id!=null){
      this.loadTableData(this.id);
    }
  }

  getCusTruckList(){
    this.service.getCusTruckList()
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.cusTruckList= result;
        this.spinner.hide();
    });
  }

  loadTableData(id:string){
    this.service.getProposalDetailList(id)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.optionForm.controls['propNo'].setValue(result.propNo);
        this.propNo=result.propNo;
        this.optionForm.controls['yard'].setValue(result.yard);
        this.optionForm.controls['estDate'].setValue(result.estDate);
        this.optionForm.controls['jobDept'].setValue(result.jobDept);
        this.jobDept=result.jobDept;
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
        this.optionForm.controls['jobType'].setValue(result.jobType);
        this.optionForm.controls['jobCode'].setValue(result.jobCode);
        this.grid.dataSource= result.proposalDetailList;
        this.spinner.hide();
    });
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      inRegNo:new FormControl(data.inRegNo),
      docCode:new FormControl(data.docCode),
      docName: new FormControl(data.docName),
      checkStatus: new FormControl(data.checkStatus),
    });
  }


    actionBegin(args: SaveEventArgs): void {
      if (args.requestType === 'delete') {
        args.cancel = true;
        const data = args.data as any[];
        const id = data[0].propNo;
        const truckNo=data[0].truckNo;
        this.deleteProposalDetail(id,truckNo);
      }
    }

    onAssignInSubmit(){
      const formData=this.rglTruckForm.value;
      const truckNo=JSON.stringify(formData.truckNo);
      formData.truckNo=truckNo;
      formData.createdUser = localStorage.getItem('currentUser');
      this.createProposalDetail(formData);
    }


      onCustomerSubmit(){
        const formData=this.customerTruckForm.value;
        const truckNo=JSON.stringify(formData.truckNo);
        formData.truckNo=truckNo;
        formData.createdUser = localStorage.getItem('currentUser');
        this.createProposalDetail(formData);
      }

      createProposalDetail(formData: any) {
        this.spinner.show();
        this.service
        .createProposalDetail(formData)
        .pipe(catchError((err) => of(this.showError(err))))
        .subscribe((result) => {
          if (result.status == true) {
            this.rglModel.hide();
            this.customerModel.hide();
            this.showSuccess(result.messageContent);
            this.loadTableData(this.id);
          } else {
            this.spinner.hide();
            Swal.fire('Proposal', result.messageContent, 'error');
          }
        });
      }

    deleteProposalDetail(id: any,truckNo:any) {
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
            .deleteProposalDetail(id,truckNo)
            .pipe(catchError((err) => of(this.showError(err))))
            .subscribe((result) => {
              if (result.status == true) {
                this.showSuccess(result.messageContent);
                this.loadTableData(this.id);
              } else {
                this.spinner.hide();
                Swal.fire('TMS Proposal Detail', result.messageContent, 'error');
              }
            });
        } else if (response.dismiss === Swal.DismissReason.cancel) {
          Swal.close();
        }
      });
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

    onJobTypeChange(jobType:string){
      if(this.type==null){
        Swal.fire("Proposal","Please Select type!","warning");
        return;
      }
      if(this.type!=null && jobType!=null){
       this.service
       .getTruckList(this.type,jobType)
       .pipe(catchError((err) => of(this.showError(err))))
       .subscribe((result) => {
        this.truckList=result;
      });
      }
    }

    onTruckChange(truckNo:string){
      let truckInfo=this.truckList.filter(t=>t.truckNo==truckNo);
      this.rglTruckForm.controls['driverName'].setValue(truckInfo[0].driverName);
      this.rglTruckForm.controls['driverContact'].setValue(truckInfo[0].driverContact);
      this.rglTruckForm.controls['truckAssignId'].setValue(truckInfo[0].regId);
    }

    // onCusTruckChange(truckNo:string){
    //   let truckInfo=this.cusTruckList.filter(t=>t.vehicleRegNo==truckNo);
    //   //this.getCusDriverList(truckInfo[0].driverLicenseNo);
    // }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport({
        fileName:'ProposalDetail.xlsx',
     });
    }

    if (args.item.id=== 'rglTruck' || args.item.id==='customerTruck') {
      //let selectedRecords: any[] = this.grid.getSelectedRecords();
      //const id = selectedRecords[0].propNo;
      //const user = localStorage.getItem('currentUser');

      if(args.item.id==='rglTruck'){
        this.rglTruckForm.reset();
        this.rglTruckForm.controls['propNo'].setValue(this.propNo);
        this.rglTruckForm.controls['jobDept'].setValue(this.jobDept);
        this.rglModel.show();
        return;
      }

      if(args.item.id==='customerTruck'){
        this.customerTruckForm.reset();
        this.customerTruckForm.controls['assignType'].setValue("Customer");
        this.customerTruckForm.controls['propNo'].setValue(this.propNo);
        this.customerTruckForm.controls['jobDept'].setValue(this.jobDept);
        this.customerModel.show();
        return;
      }
    }

  }

  exportQueryCellInfo(args: ExcelQueryCellInfoEventArgs ): void {
    if (args.column.headerText === '') {
      args.hyperLink = {
          target:  (args as any).data,
          displayText: (args as any).data
      };
    }
  }

  validateControl(controlName: string) {
    const control = this.rglTruckForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }
  customerValidateControl(controlName: string) {
    const control = this.customerTruckForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('TMS Proposal Detail', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('TMS Proposal Detail', error.statusText, 'error');
  }


}
