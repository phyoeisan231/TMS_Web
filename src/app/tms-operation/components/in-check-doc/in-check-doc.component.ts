import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EditSettingsModel, GridComponent, GridLine, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { catchError, debounceTime,of, Subject, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { InCheckService } from '../in-check/in-check.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { EmitType } from '@syncfusion/ej2/base';
import { TmsOperationModule } from '../../tms-operation.module';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import moment from 'moment';

@Component({
  selector: 'app-in-check-doc',
  standalone: true,
  imports: [TmsOperationModule],
  templateUrl: './in-check-doc.component.html',
  styleUrl: './in-check-doc.component.scss'
})
export class InCheckDocComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowEditing: false, allowAdding: false, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = [{ text: "Checked", tooltipText: "Checked", prefixIcon: "e-icons e-check", id: "check" },'Search'];
  lines: GridLine = 'Both';
  submitClicked:boolean=false;
  detailForm:any;
  id:any;
  interval: number=1;
  public format="dd/MM/yyyy h:mm:ss a";
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
  truckTypeList:any[]=['RGL','Customer','Supplier'];
  wbOptionList:any[]=['None','Single','Both'];
  billOptionList:any[]=['None','Credit','Cash'];
  endDate : Date = new Date();
  type:string;
  isWb:boolean=false;
  gpName:string;
  yard:string;
  today : Date = new Date();
  public data: Object[];
  public placeholder: string = 'Select One';
  public filterPlaceholder: string = 'Search';
  groupNameList:any[]=["ICD","Others"];
  private searchTruckTerms = new Subject<string>();
  private searchDriverTerms = new Subject<string>();
  @ViewChild('cardModel') cardModel: DialogComponent;
  @ViewChild('Grid') public grid: GridComponent;
  constructor(
    private service: InCheckService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,

  ) {}

  ngOnInit(){
    this.id = this.route.snapshot.queryParams['id'];
    this.detailForm = new FormGroup({
    inRegNo: new FormControl(''),
    inCheckDateTime: new FormControl(this.today, Validators.required),
    inGateID: new FormControl('',Validators.required),
    inYardID: new FormControl('',Validators.required),
    inPCCode: new FormControl('',Validators.required),
    truckVehicleRegNo: new FormControl('',Validators.required),
    driverLicenseNo: new FormControl('',Validators.required),
    areaID: new FormControl('',Validators.required),
    driverName: new FormControl(''),
    transporterID: new FormControl(''),
    transporterName: new FormControl(''),
    truckType:new FormControl('',Validators.required),
    trailerVehicleRegNo:new FormControl(''),
    inType:new FormControl(''),
    inCargoType:new FormControl(''),
    inCargoInfo:new FormControl(''),
    cardNo:new FormControl(''),
    remark:new FormControl(''),
    customer:new FormControl(''),
    isUseWB:new FormControl(false),
    groupName:new FormControl('',Validators.required),
    });

    this.cardForm = new FormGroup({
    inRegNo: new FormControl(''),
    cardNo: new FormControl('', Validators.required),
    inWeightBridgeID: new FormControl(''),
    outWeightBridgeID: new FormControl(''),
    inWBBillOption:new FormControl(''),
    outWBBillOption:new FormControl(''),
    });

    this.getTrailerList();
    this.getLocationList();
    this.getTransporterList();
    if(this.id){
      this.getInBoundCheckById();
    }
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

  getTrailerList(){
    this.service.getTrailerList()
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.trailerList = result;
        this.spinner.hide();
    });
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

  getTransporterList(){
    this.service.getTransporterList()
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.transporterList = result;
        this.spinner.hide();
    });
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

  getInBoundCheckById(){
    this.spinner.show();
    this.service.getInBoundCheckById(this.id)
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

  onFormAssignCard(){
      const formData=this.detailForm.value;
      const cardForm = this.cardForm.value;
      formData.cardNo = cardForm.cardNo;
      formData.inWeightBridgeID = cardForm.inWeightBridgeID;
      formData.outWeightBridgeID = cardForm.outWeightBridgeID;
      formData.outWBBillOption = cardForm.inWBBillOption;
      formData.inWBBillOption = cardForm.inWBBillOption;
      formData.documentList = this.docList;
      formData.inRegNo=0;
      formData.createdUser = localStorage.getItem('currentUser');
      formData.inCheckDateTime = moment(formData.inCheckDateTime).format('MM/DD/YYYY HH:mm:ss');
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
      if(this.isWb){
        if(!cardForm.inWeightBridgeID){
          Swal.fire('In Check Document', 'Please add In Weight Bridge.', 'warning');
          return;
        }
      }
      if(this.isWb){
        if(!cardForm.outWeightBridgeID){
          Swal.fire('In Check Document', 'Please add Out Weight Bridge.', 'warning');
          return;
        }
      }
        this.createInBoundCheck(formData);
    }

    onWBChange(code: string) {
      this.cardForm.controls['outWeightBridgeID'].setValue(code);
  }
  onFormSubmit(){
   this.spinner.show();
   const formData=this.detailForm.value;
   const doc = this.docList.filter(x=>x.checkStatus!=true);
   if(this.gpName=='ICD'){
    formData.isUseWB=false;
   }
   if(doc.length>0 && this.docList.length>0){
    Swal.fire('In Check Document', 'Please check document.', 'warning');
   }
   else{
      if(formData.isUseWB){
        this.isWb=true;
      }
      else{
        this.isWb=false
      }
      if(this.isWb){
        this.getWBDataList(formData.inYardID)
      }
      this.getCardList(formData.inYardID,this.gpName);
      this.cardModel.show();
   }
   this.spinner.hide();
  }

  onBackSubmit(){
    this.router.navigate(["/tms-operation/in-check"]);
  }

  createInBoundCheck(formData: any) {
    this.spinner.show();
    this.service
    .createInBoundCheck(formData)
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

  onYardChange(code: string) {
    this.getGateList(code);
    this.yard=code;
    if(this.gpName){
      this.getAreaList(this.yard,this.gpName);
    }
    else{
      this.areaList=[];
    }
   }

   onCategoryChange(code: string) {
    this.getDocumentSettingList(code);
   }

   onGroupNameChange(code: string) {
    this.gpName=code;
    this.getCategoryList(code);
    this.getAreaList(this.yard,code);
   }


   onTruckTypeChange(code: string) {
     this.type = code;
     this.truckList =[];
    }

    onTruckChange(id:string){
     const truck = this.truckList.filter(x=>x.vehicleRegNo==id);
     if(this.driverList){
      const driver = this.driverList.filter(x=>x.licenseNo==truck[0].driverLicenseNo);
      if(driver.length>0){
        this.detailForm.controls['driverLicenseNo'].setValue(truck[0].driverLicenseNo?truck[0].driverLicenseNo:null);
      }
     }
      this.detailForm.controls['trailerVehicleRegNo'].setValue(truck[0].trailer?truck[0].trailer:null);
      this.detailForm.controls['transporterID'].setValue(truck[0].transporterID?truck[0].transporterID:null);
    }


  getAreaList(yard:string,gp:string){
    this.spinner.show();
    this.service.getAreaList(yard,gp)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.areaList  = result;
        this.spinner.hide();
    });
  }

  getCardList(yard:string,gp:string){
    this.spinner.show();
    this.service.getCardICDList(yard,gp)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.cardList  = result;
        this.spinner.hide();
    });
  }

  getWBDataList(yard:string){
    this.spinner.show();
    this.service.getWBDataList(yard)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.wbList  = result;
        this.wbList.unshift({weightBridgeID:'None'});
        this.spinner.hide();
    });
  }

  showError(error:HttpErrorResponse){
    this.spinner.hide();
    Swal.fire('In Check Document',error.statusText,'error');
  }
  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('In Check Document', msg, 'success');
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
