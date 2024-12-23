import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { EditSettingsModel, GridComponent, GridLine, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2/base';
import { catchError, debounceTime, of, Subject, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { TmsInCheckPorposalService } from '../tms-in-check-proposal/tms-in-check-proposal.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { TmsOperationModule } from '../../tms-operation.module';
import moment from 'moment';

@Component({
  selector: 'app-tms-in-check-proposal-doc',
  standalone: true,
  imports: [TmsOperationModule],
  templateUrl: './tms-in-check-proposal-doc.component.html',
  styleUrl: './tms-in-check-proposal-doc.component.scss'
})
export class TmsInCheckProposalDocComponent {
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
  billOptionList:any[]=['None','Credit','Cash'];
  containerTypeList:any[]=["DV","FR","GP", "HC", "HQ","HG","OS","OT","PF","RF","RH","TK", "IC", "FL", "BC", "HT", "VC", "PL"];
  containerSizeList:any[]=[20,40,45];
  endDate : Date = new Date();
  type:string;
  isWb:boolean=false;
  gpName:string='TMS';
  yard:string;
  today : Date = new Date();
  poNo : any;
  truckNo:string;
  public data: Object[];
  public placeholder: string = 'Select One';
  public filterPlaceholder: string = 'Search';
  private searchTruckTerms = new Subject<string>();
  private searchDriverTerms = new Subject<string>();
  @ViewChild('cardModel') cardModel: DialogComponent;
  @ViewChild('Grid') public grid: GridComponent;
  constructor(
    private service: TmsInCheckPorposalService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,

  ) {}

  ngOnInit(){
    this.id = this.route.snapshot.queryParams['id'];
    this.poNo = this.route.snapshot.queryParams['poNo'];
    this.truckNo = this.route.snapshot.queryParams['truck'];
    this.type = this.route.snapshot.queryParams['type'];
    this.detailForm = new FormGroup({
    inRegNo: new FormControl(''),
    inCheckDateTime: new FormControl(this.today, Validators.required),
    inGateID: new FormControl('',Validators.required),
    inYardID: new FormControl('',Validators.required),
    inPCCode: new FormControl('',Validators.required),
    truckVehicleRegNo: new FormControl('',Validators.required),
    driverLicenseNo: new FormControl('',Validators.required),
    areaID: new FormControl('',Validators.required),
    propNo:new FormControl(this.poNo,Validators.required),
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
    isUseWB:new FormControl(true),
    groupName:new FormControl(this.gpName,Validators.required),
    inContainerType:new FormControl(''),
    inContainerSize:new FormControl(''),
    inContainerNo:new FormControl(''),
    jobDept:new FormControl(''),
    jobCode:new FormControl(''),
    jobType:new FormControl(''),
    blNo:new FormControl(''),
    inWBBillOption:new FormControl(''),
    outWBBillOption:new FormControl(''),
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
    else{
      if(this.poNo){
        this.getTMSProposalById();
        this.getCategoryList(this.gpName);
      }
    }

    this.searchTruckTerms.pipe(
      debounceTime(300),
      switchMap((term: string) => this.service.getTruckList(term,this.poNo,this.type))
    ).subscribe(data => {
      if(this.poNo && this.type){
        this.truckList  = data;
        if(this.truckList.length==1){
          this.detailForm.controls['truckVehicleRegNo'].setValue(this.truckList[0].vehicleRegNo?this.truckList[0].vehicleRegNo:null);
          this.onTruckChange(this.truckList[0].vehicleRegNo);
        }
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
    if (e.text) {
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

  getTMSProposalById(){
    this.spinner.show();
    this.service.getTMSProposalById(this.poNo)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.truckList=result.detailList;
        this.detailData = result;
        this.getGateList(result.yard);
        this.getDocumentSettingList(result.inPCCode);
        console.log(result)
        this.detailForm.controls['inWBBillOption'].setValue(result.weightOption?result.weightOption:null);
        this.detailForm.controls['outWBBillOption'].setValue(result.weightOption?result.weightOption:null);
        for (let key in this.detailData) {
          if ( this.detailData.hasOwnProperty(key) && this.detailData[key] != null &&  this.detailForm.controls[key]) {
            if (key != 'detailList') {
              this.detailForm.controls[key].setValue(this.detailData[key]);
            }
          }
         }
         if(this.truckNo){
          this.searchTruckTerms.next(this.truckNo);
         }
        //  this.detailForm.controls['truckVehicleRegNo'].setValue(this.truckNo?this.truckNo:null);
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

  onTruckTypeChange(code: string) {
    this.type = code;
    this.truckList =[];
   }

  onFormSubmit(){
   this.spinner.show();
   const formData=this.detailForm.value;
   const doc = this.docList.filter(x=>x.checkStatus!=true);
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
      this.getCardList(formData.inYardID,'TMS');
      this.cardForm.controls['inWBBillOption'].setValue(formData.inWBBillOption?formData.inWBBillOption:null);
      this.cardForm.controls['outWBBillOption'].setValue(formData.outWBBillOption?formData.outWBBillOption:null);
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
        this.router.navigate(["/tms-operation/tms-in-check"]);
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

    onTruckChange(id:string){
     const truck = this.truckList.filter(x=>x.vehicleRegNo==id);
     if(this.driverList){
      const driver = this.driverList.filter(x=>x.licenseNo==truck[0].driverLicenseNo);
      if(driver.length>0){
        this.detailForm.controls['driverLicenseNo'].setValue(truck[0].driverLicenseNo?truck[0].driverLicenseNo:null);
      }
     }
     if(this.truckNo==truck[0].vehicleRegNo){
      this.detailForm.controls['truckType'].setValue(truck[0].truckType?truck[0].truckType:null);
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
