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
import { YardService } from './yard.service';
@Component({
  selector: 'app-yard',
  standalone: true,
  imports: [MasterModule],
  templateUrl: './yard.component.html',
  styleUrl: './yard.component.scss'
})
export class YardComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = ['Add','Edit','Delete','ExcelExport','Search'];
  lines: GridLine = 'Both';
  yardForm: any;
  yardList:any[];
  lblText:string;
  submitClicked: boolean = false;
  public data: Object[]=[];
  formatfilter:string='dd-MMM-yyyy';
  today : Date = new Date();
  @ViewChild('Grid') public grid: GridComponent;
  constructor(
    private service: YardService,
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
     this.service.getYardList('All')
     .pipe(catchError((err) => of(this.showError(err))))
       .subscribe((result) => {
        this.yardList=result;
         this.grid.dataSource = this.yardList;
         this.grid.searchSettings.operator = "equal";
         this.spinner.hide();
     });
   this.spinner.hide();
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
      this.submitClicked = false;
      this.yardForm = this.createFormGroup(args.rowData);
    }
    else if(args.requestType === 'beginEdit'){
      this.submitClicked = false;
      this.yardForm = this.createFormGroup(args.rowData);
    }
    if (args.requestType === 'save') {
      this.submitClicked = true;
      if (this.yardForm.valid) {
        let formData = this.yardForm.value;
        formData.yardID=formData.yardID.toUpperCase();
        if (args.action === 'add') {
          formData.createdUser = localStorage.getItem('currentUser');
          this.addYard(formData);
        }
        else {
          formData.updatedUser = localStorage.getItem('currentUser');
          this.editYard(formData);
        }
      } else {
        args.cancel = true;
      }
    }
    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].yardID;
     this.deleteYard(id);
    }
  }

  actionComplete(args: DialogEditEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      if(args.requestType === 'add'){
        args!.dialog!.header="New Yard" ;
        }
        else{
          args!.dialog!.header="Edit Yard" ;
        }
        if (Browser.isDevice) {
            args!.dialog!.height = window.innerHeight - 90 + 'px';
            (<Dialog>args.dialog).dataBind();
        }
    }
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      yardID: new FormControl(data.yardID,Validators.required),
      name: new FormControl(data.name,Validators.required),
      phone:new FormControl(data.phone,Validators.required),
      email:new FormControl(data.email,[Validators.email,Validators.required]),
      address:new FormControl(data.address,Validators.required),
      active: new FormControl(data.active),
    });
  }

  addYard(formData: any) {
    this.spinner.show();
    formData.active = true;
    this.service
      .createYard(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result.status == true) {
          this.spinner.hide();
          Swal.fire('Yard', result.messageContent, 'success');
          this.loadTableData();
        } else {
          this.spinner.hide();
          this.grid.dataSource=this.yardList.filter(x=>x.yardID!=undefined);
          Swal.fire('Yard', result.messageContent, 'error');
        }
      });
  }

  editYard(formData: any) {
    this.spinner.show();
    formData.active=formData.active?true:false;
    this.service
      .updateYard(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.loadTableData();
        if (result.status == true) {
          this.showSuccess(result.messageContent);
        } else {
          this.spinner.hide();
          Swal.fire('Yard', result.messageContent, 'error');
        }
      });
  }

  deleteYard(id: any) {
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
          .deleteYard(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
              Swal.fire('Yard', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  validateControl(controlName: string) {
    const control = this.yardForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('Yard', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Yard', error.statusText, 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport({
        fileName:'YardReport.xlsx',
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
