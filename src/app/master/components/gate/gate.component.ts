import { Component,ViewChild } from '@angular/core';
import { MasterModule } from '../../master.module';
import { DialogEditEventArgs, EditSettingsModel, ExcelQueryCellInfoEventArgs, GridComponent, GridLine, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { GateService } from './gate.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Browser } from '@syncfusion/ej2/base';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinner, NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { Dialog } from '@syncfusion/ej2-angular-popups';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { catchError, of } from 'rxjs';
@Component({
  selector: 'app-gate',
  standalone: true,
  imports: [MasterModule],
  templateUrl: './gate.component.html',
  styleUrl: './gate.component.scss'
})
export class GateComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = ['Add','Edit','Delete','ExcelExport','Search'];
  lines: GridLine = 'Both';
  gateForm: any;
  lblText:string;
  locationList: string[]=['YTG','MDY','MG']
  submitClicked: boolean = false;
  public data: Object[]=[{'gateId':1,'name':'YTGGate1','location':'YTG'},{'gateId':2,'name':'YTGGate2','location':'YTG'}];
  formatfilter:string='dd-MMM-yyyy';
  today : Date = new Date();
  @ViewChild('Grid') public grid: GridComponent;
  constructor(
    private service: GateService,
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
    //  this.service.GetGateList('All')
    //  .pipe(catchError((err) => of(this.showError(err))))
    //    .subscribe((result) => {
    //      this.grid.dataSource = this.result;
    //      this.spinner.hide();
    //  });
    // console.log(this.data)

    if(this.grid){
      this.grid.dataSource = this.data;
    }
   this.spinner.hide();
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
      this.submitClicked = false;
      this.gateForm = this.createFormGroup(args.rowData);
  }
  else if(args.requestType === 'beginEdit'){
    this.submitClicked = false;
    this.gateForm = this.createFormGroup(args.rowData);
  }

  if (args.requestType === 'save') {
      this.submitClicked = true;
      if (this.gateForm.valid) {
          let formData = this.gateForm.value;
          if (args.action === 'add') {
            formData.createdUser = localStorage.getItem('currentUser');
            this.addGate(formData);
          }
          else {
            formData.updatedUser = localStorage.getItem('currentUser');
            this.updateGate(formData);
          }
      } else {
          args.cancel = true;
      }
  }

  if (args.requestType === 'delete') {
    args.cancel = true;
    const data = args.data as any[];
    const id = data[0].gateId;
   this.deleteGate(id);
  }
}

  actionComplete(args: DialogEditEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      if(args.requestType === 'add'){
        args!.dialog!.header="New Gate" ;
        }
        else{
          args!.dialog!.header="Edit Gate" ;
        }
        if (Browser.isDevice) {
            args!.dialog!.height = window.innerHeight - 90 + 'px';
            (<Dialog>args.dialog).dataBind();
        }
    }
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      gateId: new FormControl(data.gateId),
      name: new FormControl(data.name,Validators.required),
      location: new FormControl(data.location,Validators.required),
      active: new FormControl(data.active),
    });
  }

  addGate(formData: any) {
    this.spinner.show();
    formData.gateId=0;
    formData.active = true;
    // this.service
    //   .createGate(formData)
    //   .pipe(catchError((err) => of(this.showError(err))))
    //   .subscribe((result) => {
    //     if (result.status == true) {
    //       this.spinner.hide();
    //       Swal.fire('Gate', result.messageContent, 'success');
    //       this.loadTableData();
    //     } else {
    //       this.spinner.hide();
    //       Swal.fire('Gate', result.messageContent, 'error');
    //     }
    //   });
  }

  updateGate(formData: any) {
    this.spinner.show();
    // this.service
    //   .updateGate(formData)
    //   .pipe(catchError((err) => of(this.showError(err))))
    //   .subscribe((result) => {
    //     this.loadTableData();
    //     if (result.status == true) {
    //       this.showSuccess(result.messageContent);
    //     } else {
    //       this.spinner.hide();
    //       Swal.fire('Gate', result.messageContent, 'error');
    //     }
    //   });
  }
  deleteGate(id: any) {
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'You will not be able to recover this data!',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#DD6B55',
    //   cancelButtonText: 'No, keep it',
    //   confirmButtonText: 'Yes, I am sure!',
    // }).then((response: any) => {
    //   if (response.value) {
    //     this.spinner.show();
    //     this.service
    //       .deleteGate(id)
    //       .pipe(catchError((err) => of(this.showError(err))))
    //       .subscribe((result) => {
    //         if (result.status == true) {
    //           this.showSuccess(result.messageContent);
    //           this.loadTableData();
    //         } else {
    //           this.spinner.hide();
    //           Swal.fire('Gate', result.messageContent, 'error');
    //         }
    //       });
    //   } else if (response.dismiss === Swal.DismissReason.cancel) {
    //     Swal.close();
    //   }
    // });
  }


  validateControl(controlName: string) {
    const control = this.gateForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }
  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('Gate', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Gate', error.statusText, 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport({
        fileName:'GateReport.xlsx',
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
