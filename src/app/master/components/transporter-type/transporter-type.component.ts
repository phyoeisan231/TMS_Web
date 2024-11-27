import { Component, ViewChild } from '@angular/core';
import { MasterModule } from '../../master.module';
import { TransporterTypeService } from './transporter-type.service';
import { DialogEditEventArgs, EditSettingsModel, GridComponent, GridLine, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, of } from 'rxjs';
import { Browser } from '@syncfusion/ej2/base';
import { Dialog } from '@syncfusion/ej2-angular-popups';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transporter-type',
  standalone: true,
  imports: [MasterModule],
  templateUrl: './transporter-type.component.html',
  styleUrl: './transporter-type.component.scss'
})
export class TransporterTypeComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = ['Add','Edit','Delete','ExcelExport','Search'];
  lines: GridLine = 'Both';
  transForm: any;
  submitClicked: boolean = false;
  @ViewChild('Grid') public grid: GridComponent;
  constructor(
    private service: TransporterTypeService,
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
     this.service.getTransporterTypes('All')
     .pipe(catchError((err) => of(this.showError(err))))
       .subscribe((result) => {
         this.grid.dataSource = result;
         this.spinner.hide();
     });
   this.spinner.hide();
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
      this.submitClicked = false;
      this.transForm = this.createFormGroup(args.rowData);
    }
    else if(args.requestType === 'beginEdit'){
      this.submitClicked = false;
      this.transForm = this.createFormGroup(args.rowData);
    }
    if (args.requestType === 'save') {
      this.submitClicked = true;
      if (this.transForm.valid) {
        let formData = this.transForm.value;
        if (args.action === 'add') {
          formData.createdUser = localStorage.getItem('currentUser');
          this.addTransporterType(formData);
        }
        else {
          formData.updatedUser = localStorage.getItem('currentUser');
          this.editTransporterType(formData);
        }
      }
      else {
        args.cancel = true;
      }
    }
    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].typeID;
      this.deleteTransporterType(id);
    }
  }

  actionComplete(args: DialogEditEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      if(args.requestType === 'add'){
        args!.dialog!.header="New Transporter Type" ;
        }
        else{
          args!.dialog!.header="Edit Transporter Type" ;
        }
        if (Browser.isDevice) {
            args!.dialog!.height = window.innerHeight - 90 + 'px';
            (<Dialog>args.dialog).dataBind();
        }
    }
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      typeID: new FormControl(data.typeID,Validators.required),
      description: new FormControl(data.description,Validators.required),
      remarks:new FormControl(data.remarks),
      active: new FormControl(data.active),
    });
  }

  addTransporterType(formData: any) {
    this.spinner.show();
    // formData.typeCode=0;
    // formData.active = true;
    this.service
      .createTransporterType(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result.status == true) {
          this.spinner.hide();
          Swal.fire('Transporter Type', result.messageContent, 'success');
          this.loadTableData();
        } else {
          this.spinner.hide();
          Swal.fire('Transporter Type', result.messageContent, 'error');
        }
      });
  }

  editTransporterType(formData: any) {
    this.spinner.show();
    this.service
      .updateTransporterType(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.loadTableData();
        if (result.status == true) {
          this.showSuccess(result.messageContent);
        } else {
          this.spinner.hide();
          Swal.fire('Transporter Type', result.messageContent, 'error');
        }
      });
  }

  deleteTransporterType(id: any) {
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
          .deleteTransporterType(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
              Swal.fire('Transporter Type', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  validateControl(controlName: string) {
    const control = this.transForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }
  
  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('Transporter Type', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Transporter Type', error.statusText, 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport({
        fileName:'TruckTypeReport.xlsx',
     });
    }
  }

}

  


