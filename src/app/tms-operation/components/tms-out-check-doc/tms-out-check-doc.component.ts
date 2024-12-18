import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { EditSettingsModel, GridComponent, GridLine, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { EmitType } from '@syncfusion/ej2/base';
import { catchError, debounceTime, of, Subject, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { TmsOutCheckService } from '../tms-out-check/tms-out-check.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { TmsOperationModule } from '../../tms-operation.module';

@Component({
  selector: 'app-tms-out-check-doc',
  standalone: true,
  imports: [TmsOperationModule],
  templateUrl: './tms-out-check-doc.component.html',
  styleUrl: './tms-out-check-doc.component.scss'
})
export class TmsOutCheckDocComponent {
pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowEditing: false, allowAdding: false, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = [{ text: "Checked", tooltipText: "Checked", prefixIcon: "e-icons e-check", id: "check" },'Search'];
  lines: GridLine = 'Both';
  submitClicked:boolean=false;
  detailForm:any;
  id:any;
  interval: number=1;
  public format="dd/MM/yyyy h:mm:ss a";
  detailData:any;
  cargoTypeList:any[]=['Laden','MT'];
  typeList:string[]=['FCL','LCL'];
  containerTypeList:any[]=["DV","FR","GP", "HC", "HQ","HG","OS","OT","PF","RF","RH","TK", "IC", "FL", "BC", "HT", "VC", "PL"];
  containerSizeList:any[]=[20,40,45];
  yardList:any[]=[];
  gateList:any[]=[];
  pcCodeList:any[]=[];
  docList:any[]=[];
  cardList:any[]=[];
  endDate : Date = new Date();
  yard:string;
  today : Date = new Date();
  public data: Object[];
  public placeholder: string = 'Select One';
  public filterPlaceholder: string = 'Search';
  private searchCardTerms = new Subject<string>();
  @ViewChild('Grid') public grid: GridComponent;
  constructor(
    private service: TmsOutCheckService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,

  ) {}

  ngOnInit(){
    this.id = this.route.snapshot.queryParams['id'];
    this.detailForm = new FormGroup({
    outRegNo: new FormControl(''),
    inRegNo: new FormControl(''),
    outCheckDateTime: new FormControl(this.today, Validators.required),
    outGateID: new FormControl('',Validators.required),
    outYardID: new FormControl('',Validators.required),
    outPCCode: new FormControl('',Validators.required),
    truckVehicleRegNo: new FormControl('',Validators.required),
    driverLicenseNo: new FormControl('',Validators.required),
    driverName: new FormControl(''),
    driverContactNo: new FormControl(''),
    areaID: new FormControl('',Validators.required),
    transporterID: new FormControl(''),
    transporterName: new FormControl(''),
    truckType:new FormControl('',Validators.required),
    trailerVehicleRegNo:new FormControl(''),
    outType:new FormControl(''),
    outCargoType:new FormControl(''),
    outCargoInfo:new FormControl(''),
    cardNo:new FormControl(''),
    remark:new FormControl(''),
    customer:new FormControl(''),
    status:new FormControl(''),
    outboundWeight:new FormControl(false),
    outWeightBridgeID: new FormControl(''),
    groupName: new FormControl(''),
    outContainerType:new FormControl(''),
    outContainerSize:new FormControl(''),
    outContainerNo:new FormControl(''),
    jobDept:new FormControl(''),
    jobCode:new FormControl(''),
    jobType:new FormControl(''),
    blNo:new FormControl(''),
    });

    this.getLocationList();
    if(this.id){
      this.getOutBoundCheckById();
    }
    this.searchCardTerms.pipe(
      debounceTime(300),
      switchMap((term: string) => this.service.getCardICDList(term,this.yard))
    ).subscribe(data => {
      if(this.yard){
        this.cardList =data;
      }
    });
  }

  public onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
  }


  onCardFiltering(e: any) {
    if (e.text && this.yard) {
      this.searchCardTerms.next(e.text);
    }
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

  getGateList(yard:string){
    this.spinner.show();
    this.service.getGateList(yard)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.gateList  = result;
        this.spinner.hide();
    });
  }

  getDocumentSettingList(id:string){
    this.spinner.show();
    this.service.getDocumentSettingList(id)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.docList  = result;
        this.spinner.hide();
    });
  }

  getCategoryList(type:string){
     this.service.getCategoryList(type)
     .pipe(catchError((err) => of(this.showError(err))))
       .subscribe((result) => {
         this.pcCodeList = result;
         this.pcCodeList.unshift({pcCode:'None'});
         this.spinner.hide();
     });
  }


  rowDataBound(args: any): void {
    if (args.row) {
      //args.isSelectable = args.data.status === 'Draft';
      if (args.data.checkStatus) {
        (args.row as Element).classList.add('bluegreen');
      }
     }
   }

   getOutBoundCheckById(){
    this.spinner.show();
    this.service.getOutBoundCheckById(this.id)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.docList=result.documentList;
        this.detailData = result;

        for (let key in this.detailData) {
          if ( this.detailData.hasOwnProperty(key) && this.detailData[key] != null &&  this.detailForm.controls[key]) {
            if (key != 'documentList') {
              this.detailForm.controls[key].setValue(this.detailData[key]);
            }
          }
         }
        });
        this.spinner.hide();
  }


  onFormSubmit(){
   this.spinner.show();
   const formData=this.detailForm.value;
   formData.outRegNo =0;
   formData.createdUser = localStorage.getItem('currentUser');
   const doc = this.docList.filter(x=>x.checkStatus!=true);
   if(doc.length>0 && this.docList.length>0){
    Swal.fire('Out Check Document', 'Please check document.', 'warning');
   }
   else{
    formData.documentList = this.docList;
    this.createOutBoundCheck(formData);
   }
   this.spinner.hide();
  }

  onBackSubmit(){
    this.router.navigate(["/tms-operation/out-check"]);
  }

  createOutBoundCheck(formData: any) {
    this.spinner.show();
    this.service
    .createOutBoundCheck(formData)
    .pipe(catchError((err) => of(this.showError(err))))
    .subscribe((result) => {
      if (result.status == true) {
        this.showSuccess(result.messageContent);
        this.router.navigate(["/tms-operation/tms-out-check"]);
      } else {
        this.spinner.hide();
        Swal.fire('Out Check Document', result.messageContent, 'error');
      }
    });
  }

  onYardChange(code: string) {
    this.getGateList(code);
    this.yard =code;
   }

   onCategoryChange(code: string) {
    this.getDocumentSettingList(code);
   }


    onCardChange(id:string){
     const card = this.cardList.filter(x=>x.cardNo==id);
     if(card){
      this.getCategoryList(card[0].groupName);
      this.detailForm.controls['inRegNo'].setValue(card[0].inRegNo?card[0].inRegNo:null);
      this.detailForm.controls['truckVehicleRegNo'].setValue(card[0].truckVehicleRegNo?card[0].truckVehicleRegNo:null);
      this.detailForm.controls['driverLicenseNo'].setValue(card[0].driverLicenseNo?card[0].driverLicenseNo:null);
      this.detailForm.controls['driverContactNo'].setValue(card[0].driverContactNo?card[0].driverContactNo:null);
      this.detailForm.controls['driverName'].setValue(card[0].driverName?card[0].driverName:null);
      this.detailForm.controls['transporterID'].setValue(card[0].transporterID?card[0].transporterID:null);
      this.detailForm.controls['transporterName'].setValue(card[0].transporterName?card[0].transporterName:null);
      this.detailForm.controls['areaID'].setValue(card[0].areaID?card[0].areaID:null);
      this.detailForm.controls['truckType'].setValue(card[0].truckType?card[0].truckType:null);
      this.detailForm.controls['trailerVehicleRegNo'].setValue(card[0].trailerVehicleRegNo?card[0].trailerVehicleRegNo:null);
      this.detailForm.controls['customer'].setValue(card[0].customer?card[0].customer:null);
      this.detailForm.controls['groupName'].setValue(card[0].groupName?card[0].groupName:null);
      this.detailForm.controls['outboundWeight'].setValue(card[0].outboundWeight?card[0].outboundWeight:null);
      this.detailForm.controls['outWeightBridgeID'].setValue(card[0].outWeightBridgeID?card[0].outWeightBridgeID:null);
      this.detailForm.controls['outContainerType'].setValue(card[0].inContainerType?card[0].inContainerType:null);
      this.detailForm.controls['outContainerSize'].setValue(card[0].inContainerSize?card[0].inContainerSize:null);
      this.detailForm.controls['outContainerNo'].setValue(card[0].inContainerNo?card[0].inContainerNo:null);
      this.detailForm.controls['jobDept'].setValue(card[0].jobDept?card[0].jobDept:null);
      this.detailForm.controls['jobType'].setValue(card[0].jobType?card[0].jobType:null);
      this.detailForm.controls['jobCode'].setValue(card[0].jobCode?card[0].jobCode:null);
      this.detailForm.controls['blNo'].setValue(card[0].blNo?card[0].blNo:null);
     }
    }



  showError(error:HttpErrorResponse){
    this.spinner.hide();
    Swal.fire('Out Check Document',error.statusText,'error');
  }
  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('Out Check Document', msg, 'success');
  }

  validateControl(controlName: string) {
    const control = this.detailForm.get(controlName);
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
