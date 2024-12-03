import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { EditSettingsModel, GridComponent, GridLine, PageSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import Swal from 'sweetalert2';
import { InboundCheckService } from '../inbound-check/inbound-check.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { EmitType } from '@syncfusion/ej2/base';
import { catchError, forkJoin, of } from 'rxjs';
import { TmsOperationModule } from '../../tms-operation.module';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-inbound-check-doc',
  standalone: true,
  imports: [TmsOperationModule],
  templateUrl: './inbound-check-doc.component.html',
  styleUrl: './inbound-check-doc.component.scss'
})
export class InboundCheckDocComponent {
    pageSettings: PageSettingsModel = { pageSize: 10 };
    editSettings: EditSettingsModel = { allowEditing: false, allowAdding: false, allowDeleting: true, mode: 'Dialog' };
    toolbar: any[] = [{ text: "Checked", tooltipText: "Checked", prefixIcon: "e-icons e-check", id: "check" },'Search'];
    lines: GridLine = 'Both';
    submitClicked:boolean=false;
    detailForm:any;
    id:any;
    interval: number=1;
    public format="dd/MM/yyyy h:mm:ss a";
    docForm:any;
    detailData:any;
    cargoTypeList:any[]=['Laden','Empty'];
    containerTypeList:any[]=["DV","FR","GP", "HC", "HQ","HG","OS","OT","PF","RF","RH","TK", "IC", "FL", "BC", "HT", "VC", "PL"];
    containerSizeList:any[]=[20,40,45];
    truckTypeList:any[]=['RGL','Customer'];
    areaList:any[]=[];
    typeList: any[]=['FCL','LCL'];
    itemList:any[]=[];
    docList:any[]=[];
    trailerList:any[]=[];
    driverList:any[]=[];
    transporterList:any[]=[];
    cardList:any[]=[];
    pcCodeList:any[]=[];
    today:Date=new Date();
    public filterPlaceholder: string = 'Search';
    @ViewChild('Grid') public grid: GridComponent;
    constructor(
      private service: InboundCheckService,
      private spinner: NgxSpinnerService,
      private route: ActivatedRoute,
      private router: Router,

    ) {}

    ngOnInit(){
      this.id = this.route.snapshot.queryParams['id'];
      this.detailForm = new FormGroup({
      inRegNo: new FormControl(this.id),
      inCheckDateTime: new FormControl('', Validators.required),
      inGateID: new FormControl('',Validators.required),
      inYardID: new FormControl('',Validators.required),
      inPCCode: new FormControl('',Validators.required),
      truckVehicleRegNo: new FormControl('',Validators.required),
      driverLicenseNo: new FormControl('',Validators.required),
      areaID: new FormControl('',Validators.required),
      driverName: new FormControl('',Validators.required),
      transporterID: new FormControl(''),
      transporterName: new FormControl(''),
      truckType:new FormControl('',Validators.required),
      trailerVehicleRegNo:new FormControl(''),
      inType:new FormControl(''),
      inContainerType:new FormControl(''),
      inContainerSize:new FormControl(''),
      inCargoType:new FormControl(''),
      inCargoInfo:new FormControl(''),
      inNoOfContainer:new FormControl(''),
      jobCode:new FormControl(''),
      jobDescription:new FormControl(''),
      cardNo:new FormControl('',Validators.required),
      remark:new FormControl(''),
      customer:new FormControl(''),
      status:new FormControl(''),
      });
      this.getInBoundCheckById();
    }

    public onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {

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
          // this.getAreaList(result.inYardID);
          // this.getCardList(result.inYardID);
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
          console.log(result)

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


    onFormSubmit(){
     this.spinner.show();
     const formData=this.detailForm.value;
     this.updateInBoundCheck(formData)
    }
    onBackSubmit(){
      this.router.navigate(["/tms-operation/inbound-check"]);
    }

    updateInBoundCheck(formData: any) {
      this.spinner.show();
      this.service
      .updateInBoundCheck(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result.status == true) {
          this.showSuccess(result.messageContent);
          this.router.navigate(["/tms-operation/inbound-check"]);
        } else {
          this.spinner.hide();
          Swal.fire('In Check Document', result.messageContent, 'error');
        }
      });
    }

    actionBegin(args: SaveEventArgs): void {
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

      if (args.requestType === 'delete') {
        args.cancel = true;
        const data = args.data as any[];
        const id = data[0].inRegNo;
        const code= data[0].docCode;
        this.deleteInBoundCheckDocument(id, code);

      }
    }

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



    updateInBoundCheckDocument(docList:string,id:number,user:string) {
      this.spinner.show();
      this.service
        .updateInBoundCheckDocument(docList,id,user)
        .pipe(catchError((err) => of(this.showError(err))))
        .subscribe((result) => {
          if (result.status == true) {
            this.getInBoundCheckById();
            this.showSuccess(result.messageContent);
          } else {
            this.spinner.hide();
            Swal.fire('In Check Document', result.messageContent, 'error');
          }
        });
    }

    deleteInBoundCheckDocument(id:number,code: string){
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
            .deleteInBoundCheckDocument(id,code)
            .pipe(catchError((err) => of(this.showError(err))))
            .subscribe((result) => {
              if (result.status == true) {
                this.showSuccess(result.messageContent);
                this.getInBoundCheckById();
              } else {
                this.spinner.hide();
                Swal.fire('In Check Document', result.messageContent, 'error');
              }
            });
        } else if (response.dismiss === Swal.DismissReason.cancel) {
          Swal.close();
        }
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

    getCardList(yard:string){
      this.spinner.show();
      this.service.getCardICDList(yard)
      .pipe(catchError((err) => of(this.showError(err))))
        .subscribe((result) => {
          this.cardList  = result;
          console.log(this.cardList)
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
      const control = this.docForm.get(controlName);
      return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
    }

    toolbarClick(args: ClickEventArgs): void {
      if (args.item.id === 'check') {
        let selectedRecords: any[] = this.grid.getSelectedRecords();
        if (selectedRecords.length == 0) {
          Swal.fire('Check Document', "Please select one row!", 'warning');
        }

        else {
          const id = selectedRecords[0].inRegNo;
          const user = localStorage.getItem('currentUser');
          if (args.item.id === 'check')
          {
            var docList: string=selectedRecords[0].docCode;
            if (selectedRecords.length > 1) {
               docList = selectedRecords.map(item => `'${item.docCode}'`).join(',');
            }
            this.updateInBoundCheckDocument(docList,id,user)
          }
          return;
        }

      }
    }

}
