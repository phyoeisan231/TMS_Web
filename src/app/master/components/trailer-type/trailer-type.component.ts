import { Component, ViewChild } from '@angular/core';
import { MasterModule } from '../../master.module';
import { DialogEditEventArgs, EditSettingsModel, ExcelQueryCellInfoEventArgs, GridComponent, GridLine, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, of } from 'rxjs';
import { Browser } from '@syncfusion/ej2/base';
import { Dialog } from '@syncfusion/ej2-angular-popups';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { TrailerTypeService } from './trailer-type.service';

@Component({
  selector: 'app-trailer-type',
  standalone: true,
  imports: [MasterModule],
  templateUrl: './trailer-type.component.html',
  styleUrl: './trailer-type.component.scss'
})
export class TrailerTypeComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = ['Add','Edit','Delete','ExcelExport','Search'];
  lines: GridLine = 'Both';
  trailerForm: any;
  submitClicked: boolean = false;
  @ViewChild('Grid') public grid: GridComponent;
  constructor(
    private service: TrailerTypeService,
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
     this.service.getTrailerTypeList('All')
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
      this.trailerForm = this.createFormGroup(args.rowData);
    }
    else if(args.requestType === 'beginEdit'){
      this.submitClicked = false;
      this.trailerForm = this.createFormGroup(args.rowData);
    }
    if (args.requestType === 'save') {
      this.submitClicked = true;
      if (this.trailerForm.valid) {
        let formData = this.trailerForm.value;
        if (args.action === 'add') {
          formData.createdUser = localStorage.getItem('currentUser');
          this.addTrailerType(formData);
          
        }
        else {
          formData.updatedUser = localStorage.getItem('currentUser');
          this.updateTrailerType(formData);
        }
      }
      else {
        args.cancel = true;
      }
    }
    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].description;
      this.deleteTrailerType(id);
    }
  }



  actionComplete(args: DialogEditEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      if(args.requestType === 'add'){
        args!.dialog!.header="New Trailer Type" ;
        }
        else{
          args!.dialog!.header="Edit Trailer Type" ;
        }
        if (Browser.isDevice) {
            args!.dialog!.height = window.innerHeight - 90 + 'px';
            (<Dialog>args.dialog).dataBind();
        }
    }
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      typeCode: new FormControl(data.typeCode),
      description: new FormControl(data.description,Validators.required),
      active: new FormControl(data.active),
    });
  }

  addTrailerType(formData: any) {
    this.spinner.show();
    formData.typeCode=0;
    formData.active = true;
    this.service
      .createTrailerType(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result.status == true) {
          this.spinner.hide();
          Swal.fire('Trailer Type', result.messageContent, 'success');
          this.loadTableData();
        } else {
          this.spinner.hide();
          Swal.fire('Trailer Type', result.messageContent, 'error');
        }
      });
  }

  updateTrailerType(formData: any) {
    this.spinner.show();
    this.service
      .updateTrailerType(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.loadTableData();
        if (result.status == true) {
          this.showSuccess(result.messageContent);
        } else {
          this.spinner.hide();
          Swal.fire('TrailerType', result.messageContent, 'error');
        }
      });
  }
  deleteTrailerType(id: any) {
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
          .deleteTrailerType(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
              Swal.fire('Trailer Type', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }


  validateControl(controlName: string) {
    const control = this.trailerForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }
  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('Trailer Type', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Trailer Type', error.statusText, 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport({
        fileName:'TrailerTypeReport.xlsx',
     });
    }
  }


}
