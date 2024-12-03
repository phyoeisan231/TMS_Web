import { Component, ViewChild } from '@angular/core';
import { DialogEditEventArgs, EditSettingsModel, ExcelQueryCellInfoEventArgs, GridComponent, GridLine, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { CategoryService } from './category.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { catchError, finalize, of } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Browser } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-angular-popups';
import { MasterModule } from '../../master.module';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [MasterModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = ['Add','Edit','Delete','ExcelExport','Search'];
  lines: GridLine = 'Both';
  categoryForm: any;
  groupNameList:any[]=["ICD","Customer","Others"];
  categoryList:any[];
  lblText:string;
  submitClicked: boolean = false;
  public data: Object[]=[];
  formatfilter:string='dd-MMM-yyyy';
  today : Date = new Date();
  @ViewChild('Grid') public grid: GridComponent;
  constructor(
    private service: CategoryService,
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
     this.service.getCategoryList('All')
     .pipe(catchError((err) => of(this.showError(err))))
       .subscribe((result) => {
         this.categoryList=result;
         this.grid.dataSource=this.categoryList;
         this.spinner.hide();
     });
   this.spinner.hide();
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      pcCode: new FormControl(data.pcCode,Validators.required),
      categoryName: new FormControl(data.categoryName,Validators.required),
      inboundWeight: new FormControl(data.inboundWeight??""),
      outboundWeight: new FormControl(data.outboundWeight??""),
      groupName: new FormControl(data.groupName,Validators.required),
      active: new FormControl(data.active),
    });
  }


  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
      this.submitClicked = false;
      this.categoryForm = this.createFormGroup(args.rowData);
    }
    else if(args.requestType === 'beginEdit'){
      this.submitClicked = false;
      this.categoryForm = this.createFormGroup(args.rowData);
    }
    if (args.requestType === 'save') {
      this.submitClicked = true;
      if (this.categoryForm.valid) {
        let formData = this.categoryForm.value;
        formData.pcCode=formData.pcCode.toUpperCase();
        if (args.action === 'add') {
          formData.createdUser = localStorage.getItem('currentUser');
          this.addCategory(formData);
        }
        else {
          formData.updatedUser = localStorage.getItem('currentUser');
          this.editCategory(formData);
        }
      } else {
        args.cancel = true;
      }
    }
    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].pcCode;
     this.deleteCategory(id);
    }
  }

  actionComplete(args: DialogEditEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      if(args.requestType === 'add'){
        args!.dialog!.header="New Category" ;
        }
        else{
          args!.dialog!.header="Edit Category" ;
        }
        if (Browser.isDevice) {
            args!.dialog!.height = window.innerHeight - 90 + 'px';
            (<Dialog>args.dialog).dataBind();
        }
    }
  }

  
  addCategory(formData: any) {
    this.spinner.show();
    formData.active=true;
    this.service
      .createCategory(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result.status == true) {
          this.spinner.hide();
          Swal.fire('Category', result.messageContent, 'success');
          this.loadTableData();
        } else {
          this.spinner.hide();
          this.grid.dataSource=this.categoryList.filter(x=>x.pcCode!=undefined);
          Swal.fire('Category', result.messageContent, 'error');

        }
      });
  }

  editCategory(formData: any) {
    this.spinner.show();
    formData.active=formData.active?true:false;
    this.service
      .updateCategory(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.loadTableData();
        if (result.status == true) {
          this.showSuccess(result.messageContent);
        } else {
          this.spinner.hide();
          Swal.fire('Category', result.messageContent, 'error');
        }
      });
  }

  deleteCategory(id: any) {
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
          .deleteCategory(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
              Swal.fire('Category', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  validateControl(controlName: string) {
    const control = this.categoryForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('Category', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Category', error.statusText, 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport({
        fileName:'CategoryReport.xlsx',
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
