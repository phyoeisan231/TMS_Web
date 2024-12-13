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
import { DocumentSettingService } from './document-setting.service';
@Component({
  selector: 'app-document-setting',
  standalone: true,
  imports: [MasterModule],
  templateUrl: './document-setting.component.html',
  styleUrl: './document-setting.component.scss'
})
export class DocumentSettingComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = ['Add','Edit','Delete','ExcelExport','Search'];
  lines: GridLine = 'Both';
  docForm: any;
  lblText:string;
  categoryList:any[]=[];
  docSettingList:any[];
  submitClicked: boolean = false;
  public data: Object[]=[];
  formatfilter:string='dd-MMM-yyyy';
  today : Date = new Date();
  @ViewChild('Grid') public grid: GridComponent;
  constructor(
    private service: DocumentSettingService,
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
      documents: this.service.getDocumentSettings('All').pipe(catchError((err) => of(this.showError(err)))),
      categories: this.service.getCategoryList('true').pipe(catchError((err) => of([]))) // Ensure no error is thrown for yardList
    }).subscribe({
      next: ({ documents, categories }) => {
        this.docSettingList=documents;
        this.grid.dataSource = this.docSettingList;
        this.grid.searchSettings.operator = "equal";
        this.categoryList = categories;
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
      this.docForm = this.createFormGroup(args.rowData);
  }
  else if(args.requestType === 'beginEdit'){
    this.submitClicked = false;
    this.docForm = this.createFormGroup(args.rowData);
  }

  if (args.requestType === 'save') {
      this.submitClicked = true;
      if (this.docForm.valid) {
          let formData = this.docForm.value;
          formData.docCode=formData.docCode.toUpperCase();
          if (args.action === 'add') {
            formData.createdUser = localStorage.getItem('currentUser');
            this.addDocSetting(formData);
          }
          else {
            formData.updatedUser = localStorage.getItem('currentUser');
            this.updateDocSetting(formData);
          }
      } else {
          args.cancel = true;
      }
  }

  if (args.requestType === 'delete') {
    args.cancel = true;
    const data = args.data as any[];
    const id = data[0].docCode;
   this.deleteDocumentSettings(id);
  }
}

actionComplete(args: DialogEditEventArgs): void {
  if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
    if(args.requestType === 'add'){
      args!.dialog!.header="New Document Setting" ;
      }
      else{
        args!.dialog!.header="Edit Document Setting" ;
      }
      if (Browser.isDevice) {
          args!.dialog!.height = window.innerHeight - 90 + 'px';
          (<Dialog>args.dialog).dataBind();
      }
  }
}

createFormGroup(data: any): FormGroup {
  return new FormGroup({
    docCode: new FormControl(data.docCode,Validators.required),
    docName: new FormControl(data.docName,Validators.required),
    pcCode: new FormControl(data.pcCode,Validators.required),
    attachRequired: new FormControl(data.attachRequired),
    active: new FormControl(data.active),
    isInDoc:new FormControl(data.isInDoc),
    isOutDoc:new FormControl(data.isOutDoc)
  });
}

addDocSetting(formData: any) {
  this.spinner.show();
  formData.active = true;
  formData.attachRequired=formData.attachRequired?true:false;
  formData.isInDoc=formData.isInDoc?true:false;
  formData.isOutDoc=formData.isOutDoc?true:false;
  this.service
    .createDocumentSetting(formData)
    .pipe(catchError((err) => of(this.showError(err))))
    .subscribe((result) => {
      if (result.status == true) {
        this.spinner.hide();
        Swal.fire('Document Setting', result.messageContent, 'success');
        this.loadTableData();
      } else {
        this.spinner.hide();
        this.grid.dataSource = this.docSettingList.filter(x=>x.docCode!=undefined);
        Swal.fire('Document Setting', result.messageContent, 'error');
      }
    });
}

updateDocSetting(formData: any) {
  this.spinner.show();
  formData.active=formData.active?true:false;
  formData.attachRequired=formData.attachRequired?true:false;
  formData.isInDoc=formData.isInDoc?true:false;
  formData.isOutDoc=formData.isOutDoc?true:false;
  this.service
    .updateDocumentSetting(formData)
    .pipe(catchError((err) => of(this.showError(err))))
    .subscribe((result) => {
      this.loadTableData();
      if (result.status == true) {
        this.showSuccess(result.messageContent);
      } else {
        this.spinner.hide();
        Swal.fire('Document Setting', result.messageContent, 'error');
      }
    });
}

deleteDocumentSettings(id: any) {
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
        .deleteDocumentSetting(id)
        .pipe(catchError((err) => of(this.showError(err))))
        .subscribe((result) => {
          if (result.status == true) {
            this.showSuccess(result.messageContent);
            this.loadTableData();
          } else {
            this.spinner.hide();
            Swal.fire('Document Setting', result.messageContent, 'error');
          }
        });
    } else if (response.dismiss === Swal.DismissReason.cancel) {
      Swal.close();
    }
  });
}

validateControl(controlName: string) {
  const control = this.docForm.get(controlName);
  return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
}

showSuccess(msg: string) {
  this.spinner.hide();
  Swal.fire('Document Setting', msg, 'success');
}

showError(error: HttpErrorResponse) {
  this.spinner.hide();
  Swal.fire('Document Setting', error.statusText, 'error');
}

toolbarClick(args: ClickEventArgs): void {
  if(args.item.text === 'Excel Export'){
    this.grid.excelExport({
      fileName:'DocumentSettingReport.xlsx',
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
