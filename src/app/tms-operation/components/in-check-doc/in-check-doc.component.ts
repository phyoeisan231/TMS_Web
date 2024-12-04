import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EditSettingsModel, GridComponent, GridLine, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { catchError, debounceTime, forkJoin, of, Subject, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { InCheckService } from '../in-check/in-check.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { EmitType } from '@syncfusion/ej2/base';
import { TmsOperationModule } from '../../tms-operation.module';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

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
  yardList:any[]=[];
  gateList:any[]=[];
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
  today : Date = new Date();
  public data: Object[];
  public placeholder: string = 'Select One';
  public filterPlaceholder: string = 'Search';
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
    status:new FormControl(''),
    inboundWeight:new FormControl(''),
    outboundWeight:new FormControl(''),
    });

    this.cardForm = new FormGroup({
    inRegNo: new FormControl(''),
    cardNo: new FormControl('', Validators.required),
    });

    this.getCategoryList();
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

  getCategoryList(){
     this.service.getCategoryList()
     .pipe(catchError((err) => of(this.showError(err))))
       .subscribe((result) => {
         this.pcCodeList = result;
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
        forkJoin({
          areaList: this.service.getAreaList(result.inYardID).pipe(
            catchError((err) => {
              this.showError(err);
              return of([]);
            })
          ),
           cardList: this.service.getCardICDList(result.inYardID).pipe(
            catchError((err) => {
              this.showError(err);
              return of([]);
            })
          )
        }).subscribe(({ areaList,cardList }) => {
          if (areaList) {
            this.areaList  = areaList;
          } else {
            this.areaList=[];
          }
          if (cardList) {
            this.cardList  = cardList;
          } else {
            this.cardList=[];
          }
        for (let key in this.detailData) {
          if ( this.detailData.hasOwnProperty(key) && this.detailData[key] != null &&  this.detailForm.controls[key]) {
            if (key != 'documentList') {
              this.detailForm.controls[key].setValue(this.detailData[key]);
            }
          }
        }
        });

        // this.detailForm.controls['inRegNo'].setValue(this.id);
        // this.detailForm.controls['inCheckDateTime'].setValue(result.inCheckDateTime);
        // this.detailForm.controls['inGateID'].setValue(result.inGateID);
        // this.detailForm.controls['inYardID'].setValue(result.inYardID);
        // this.detailForm.controls['inPCCode'].setValue(result.inPCCode);
        // this.detailForm.controls['truckVehicleRegNo'].setValue(result.truckVehicleRegNo);
        // this.detailForm.controls['driverLicenseNo'].setValue(result.driverLicenseNo);
        // this.detailForm.controls['areaID'].setValue(result.areaID);
        // this.detailForm.controls['driverName'].setValue(result.driverName);
        // this.detailForm.controls['transporterID'].setValue(result.transporterID);
        // this.detailForm.controls['transporterName'].setValue(result.transporterName);
        // this.detailForm.controls['truckType'].setValue(result.truckType);
        // this.detailForm.controls['trailerVehicleRegNo'].setValue(result.trailerVehicleRegNo);
        // this.docList=result.documentList;
        this.spinner.hide();
    });
  }

  onFormAssignCard(){
    const formData=this.detailForm.value;
    const cardForm = this.cardForm.value;
    formData.cardNo = cardForm.cardNo;
    formData.documentList = this.docList;
    formData.inRegNo=0;
    formData.createdUser = localStorage.getItem('currentUser');
    if(this.transporterList){
      const transporter = this.transporterList.filter(x=>x.transporterID==formData.transporterID);
      if(transporter){
        formData.transporterName = transporter[0].transporterName;
      }
    }
    if(this.driverList){
      const driver = this.driverList.filter(x=>x.licenseNo==formData.driverLicenseNo);
      if(driver){
        formData.driverName = driver[0].name;
      }
    }
    this.createInBoundCheck(formData);
  }

  onFormSubmit(){
   this.spinner.show();
   const doc = this.docList.filter(x=>x.checkStatus!=true);
   if(doc.length>0 && this.docList.length>0){
    Swal.fire('In Check Document', 'Please check document.', 'warning');
   }
   else{
      this.cardModel.show();
   }
   this.spinner.hide();
  }

  onBackSubmit(){
    this.router.navigate(["/tms-operation/in-check"]);
  }

  // updateInBoundCheck(formData: any) {
  //   this.spinner.show();
  //   this.service
  //   .updateInBoundCheck(formData)
  //   .pipe(catchError((err) => of(this.showError(err))))
  //   .subscribe((result) => {
  //     if (result.status == true) {
  //       this.showSuccess(result.messageContent);
  //       this.router.navigate(["/tms-operation/in-check"]);
  //     } else {
  //       this.spinner.hide();
  //       Swal.fire('In Check Document', result.messageContent, 'error');
  //     }
  //   });
  // }
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
    this.getAreaList(code);
    this.getCardList(code);
   }

   onCategoryChange(code: string) {
    this.getDocumentSettingList(code);
   }

   onTruckTypeChange(code: string) {
     this.type = code;
     this.truckList =[];
    }

    onTruckChange(id:string){
     const truck = this.truckList.filter(x=>x.vehicleRegNo==id);
     this.detailForm.controls['driverLicenseNo'].setValue(truck[0].driverLicenseNo?truck[0].driverLicenseNo:'');
     this.detailForm.controls['transporterID'].setValue(truck[0].transporterID?truck[0].transporterID:'');
    }


  //actionBegin(args: SaveEventArgs): void {
    // if (args.requestType === 'add') {
    //     this.submitClicked = false;
    //     this.docForm = this.createFormGroup(args.rowData);
    //     // const invMList = this.invMethodList.filter(x=> x.iMethodCode == 'FIFO');
    //     // this.saleOrderItemForm.controls['invMethod'].setValue(invMList[0].description);
    // }

    // else if(args.requestType === 'beginEdit'){
    //   this.submitClicked = false;
    //   this.docForm = this.createFormGroup(args.rowData);
    // }

    // if (args.requestType === 'save') {
    //     this.submitClicked = true;
    //     if (this.docForm.valid) {
    //       let formData = this.docForm.value;
    //         if (args.action === 'add') {
    //             formData.srNo=0;
    //             formData.createdUser = localStorage.getItem('currentUser');

    //         }
    //         else {
    //           formData.updatedUser = localStorage.getItem('currentUser');
    //           this.updateInBoundCheckDocument(formData);
    //         }
    //     } else {
    //         args.cancel = true;
    //     }
    // }

    // if (args.requestType === 'delete') {
    //   args.cancel = true;
    //   const data = args.data as any[];
    //   const id = data[0].inRegNo;
    //   const code= data[0].docCode;
    //   this.deleteInBoundCheckDocument(id, code);

    // }
  //}

  // actionComplete(args: DialogEditEventArgs): void {
  //   if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
  //     args.dialog.width = 750;
  //     if(args.requestType === 'add'){
  //       args!.dialog!.header="New In Check Document" ;
  //       }
  //       else{
  //         args!.dialog!.header="Edit In Check Document" ;
  //       }
  //       if (Browser.isDevice) {
  //           args!.dialog!.height = window.innerHeight - 90 + 'px';
  //           (<Dialog>args.dialog).dataBind();
  //       }
  //   }
  // }



  // createFormGroup(data: any): FormGroup {
  //   return new FormGroup({
  //     inRegNo:new FormControl(data.inRegNo),
  //     docCode:new FormControl(data.docCode),
  //     docName: new FormControl(data.docName),
  //     checkStatus: new FormControl(data.checkStatus),
  //   });
  // }



  // updateInBoundCheckDocument(docList:string,id:number,user:string) {
  //   this.spinner.show();
  //   this.service
  //     .updateInBoundCheckDocument(docList,id,user)
  //     .pipe(catchError((err) => of(this.showError(err))))
  //     .subscribe((result) => {
  //       if (result.status == true) {
  //         // this.getInBoundCheckById();
  //         this.showSuccess(result.messageContent);
  //       } else {
  //         this.spinner.hide();
  //         Swal.fire('In Check Document', result.messageContent, 'error');
  //       }
  //     });
  // }

  // deleteInBoundCheckDocument(id:number,code: string){
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You will not be able to recover this data!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#DD6B55',
  //     cancelButtonText: 'No, keep it',
  //     confirmButtonText: 'Yes, I am sure!',
  //   }).then((response: any) => {
  //     if (response.value) {
  //       this.spinner.show();
  //       this.service
  //         .deleteInBoundCheckDocument(id,code)
  //         .pipe(catchError((err) => of(this.showError(err))))
  //         .subscribe((result) => {
  //           if (result.status == true) {
  //             this.showSuccess(result.messageContent);
  //             // this.getInBoundCheckById();
  //           } else {
  //             this.spinner.hide();
  //             Swal.fire('In Check Document', result.messageContent, 'error');
  //           }
  //         });
  //     } else if (response.dismiss === Swal.DismissReason.cancel) {
  //       Swal.close();
  //     }
  //   });
  // }
  getAreaList(yard:string){
    this.spinner.show();
    this.service.getAreaList(yard)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.areaList  = result;
        this.spinner.hide();
    });
  }

  getCardList(yard:string){
    this.spinner.show();
    this.service.getCardICDList(yard)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.cardList  = result;
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
              if (x.docCode === this.docList[i].docCode) {
                  return { ...x, docCode:  this.docList[i].docCode,docName: this.docList[i].docName,checkStatus: true};//update data
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
