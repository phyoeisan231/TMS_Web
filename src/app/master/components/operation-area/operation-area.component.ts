import { Component,ViewChild } from '@angular/core';
import { MasterModule } from '../../master.module';
import { DialogEditEventArgs, EditSettingsModel, ExcelQueryCellInfoEventArgs, GridComponent, GridLine, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Browser } from '@syncfusion/ej2/base';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinner, NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { Dialog } from '@syncfusion/ej2-angular-popups';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { catchError, of } from 'rxjs';
import { forkJoin } from 'rxjs';
import { OperationAreaService } from './operation-area.service';
@Component({
  selector: 'app-operation-area',
  standalone: true,
  imports: [MasterModule],
  templateUrl: './operation-area.component.html',
  styleUrl: './operation-area.component.scss'
})
export class OperationAreaComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = ['Add','Edit','Delete','ExcelExport','Search'];
  lines: GridLine = 'Both';
  opForm: any;
  lblText:string;
  yardList:any[]=[];
  areaList:any[];
  submitClicked: boolean = false;
  public data: Object[]=[];
  formatfilter:string='dd-MMM-yyyy';
  today : Date = new Date();
  @ViewChild('Grid') public grid: GridComponent;
  constructor(
    private service: OperationAreaService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(){
    this.loadTableData();
  }
  
  rowDataBound(args: any): void {
    if (args.row) {
      if (args.data.active!=true) {
        args.row.classList.add('not-Use');
      }
    }
  }

  loadTableData() {
    this.spinner.show();
    // Use forkJoin to wait for both requests to complete
    forkJoin({
      opAreas: this.service.getOperationAreas('All').pipe(catchError((err) => of(this.showError(err)))),
      yards: this.service.getYardList('true').pipe(catchError((err) => of([]))) // Ensure no error is thrown for yardList
    }).subscribe({
      next: ({ opAreas, yards }) => {
        this.areaList = opAreas;
        this.grid.dataSource=this.areaList;
        this.yardList = yards;
      },
      error: (error) => {
        console.error('Error loading data', error);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
      this.submitClicked = false;
      this.opForm = this.createFormGroup(args.rowData);
  }
  else if(args.requestType === 'beginEdit'){
    this.submitClicked = false;
    this.opForm = this.createFormGroup(args.rowData);
  }

  if (args.requestType === 'save') {
      this.submitClicked = true;
      if (this.opForm.valid) {
          let formData = this.opForm.value;
          formData.areaID=formData.areaID.toUpperCase();
          if (args.action === 'add') {
            formData.createdUser = localStorage.getItem('currentUser');
            this.addOperationArea(formData);
          }
          else {
            formData.updatedUser = localStorage.getItem('currentUser');
            this.editOperationArea(formData);
          }
      } else {
          args.cancel = true;
      }
  }

  if (args.requestType === 'delete') {
    args.cancel = true;
    const data = args.data as any[];
    const id = data[0].areaID;
   this.deleteOpArea(id);
  }
}

actionComplete(args: DialogEditEventArgs): void {
  if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
    if(args.requestType === 'add'){
      args!.dialog!.header="New Operation Area" ;
      }
      else{
        args!.dialog!.header="Edit Operation Area" ;
      }
      if (Browser.isDevice) {
          args!.dialog!.height = window.innerHeight - 90 + 'px';
          (<Dialog>args.dialog).dataBind();
      }
  }
}

createFormGroup(data: any): FormGroup {
  return new FormGroup({
    areaID: new FormControl(data.areaID,Validators.required),
    name: new FormControl(data.name,Validators.required),
    yardID: new FormControl(data.yardID,Validators.required),
    active: new FormControl(data.active),
    isWaitingArea:new FormControl(data.isWaitingArea),
  });
}

addOperationArea(formData: any) {
  this.spinner.show();
  formData.active = true;
  formData.isWaitingArea=false;
  this.service
    .createOperationArea(formData)
    .pipe(catchError((err) => of(this.showError(err))))
    .subscribe((result) => {
      if (result.status == true) {
        this.spinner.hide();
        Swal.fire('OperationArea', result.messageContent, 'success');
        this.loadTableData();
      } else {
        this.spinner.hide();
        this.grid.dataSource = this.areaList.filter(x=>x.areaID!=undefined);
        Swal.fire('OperationArea', result.messageContent, 'error');
      }
    });
}

editOperationArea(formData: any) {
  this.spinner.show();
  formData.active=formData.active?true:false;
  formData.isWaitingArea=formData.isWaitingArea?true:false;
    this.service
    .updateOperationArea(formData)
    .pipe(catchError((err) => of(this.showError(err))))
    .subscribe((result) => {
      this.loadTableData();
      if (result.status == true) {
        this.showSuccess(result.messageContent);
      } else {
        this.spinner.hide();
        Swal.fire('OperationArea', result.messageContent, 'error');
      }
    });
}

deleteOpArea(id: any) {
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
        .deleteOperationArea(id)
        .pipe(catchError((err) => of(this.showError(err))))
        .subscribe((result) => {
          if (result.status == true) {
            this.showSuccess(result.messageContent);
            this.loadTableData();
          } else {
            this.spinner.hide();
            Swal.fire('OperationArea', result.messageContent, 'error');
          }
        });
    } else if (response.dismiss === Swal.DismissReason.cancel) {
      Swal.close();
    }
  });
}

validateControl(controlName: string) {
  const control = this.opForm.get(controlName);
  return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
}

showSuccess(msg: string) {
  this.spinner.hide();
  Swal.fire('OperationArea', msg, 'success');
}

showError(error: HttpErrorResponse) {
  this.spinner.hide();
  Swal.fire('OperationArea', error.statusText, 'error');
}

toolbarClick(args: ClickEventArgs): void {
  if(args.item.text === 'Excel Export'){
    this.grid.excelExport({
      fileName:'OperationAreaReport.xlsx',
   });
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

}