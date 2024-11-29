import { Component,ViewChild } from '@angular/core';
import { MasterModule } from '../../master.module';
import { DialogEditEventArgs, EditSettingsModel, ExcelQueryCellInfoEventArgs, GridComponent, GridLine, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Browser } from '@syncfusion/ej2-base';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinner, NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { Dialog } from '@syncfusion/ej2-angular-popups';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { catchError, of } from 'rxjs';
import { forkJoin } from 'rxjs';
import { WaitingAreaService } from './waiting-area.service';
@Component({
  selector: 'app-waiting-area',
  standalone: true,
  imports: [MasterModule],
  templateUrl: './waiting-area.component.html',
  styleUrl: './waiting-area.component.scss'
})
export class WaitingAreaComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = ['Add','Edit','Delete','ExcelExport','Search'];
  lines: GridLine = 'Both';
  wAreaForm: any;
  id: string;
  lblText:string;
  yardList:any[]=[];
  submitClicked: boolean = false;
  public data: Object[];
  formatfilter:string='dd-MMM-yyyy';
  today : Date = new Date();
  @ViewChild('Grid') public grid: GridComponent;
  constructor(
    private service: WaitingAreaService,
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
    forkJoin({
      wAreaList: this.service.getWaitingAreaList('All').pipe(catchError((err) => of(this.showError(err)))),
      yardList: this.service.getYardList('true').pipe(catchError((err) => of([]))) // Ensure no error is thrown for yardList
    }).subscribe({
      next: ({wAreaList,yardList }) => {
        this.grid.dataSource = wAreaList;
        this.yardList = yardList;
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
      this.wAreaForm = this.createFormGroup(args.rowData);
    }
    else if(args.requestType === 'beginEdit'){
      this.submitClicked = false;
      this.wAreaForm = this.createFormGroup(args.rowData);
    }
    if (args.requestType === 'save') {
      this.submitClicked = true;
      if (this.wAreaForm.valid) {
          let formData = this.wAreaForm.getRawValue();
          if (args.action === 'add') {
            formData.createdUser = localStorage.getItem('currentUser');
            formData.areaID='';
            this.addWaitingArea(formData);
          }
          else {
            formData.updatedUser = localStorage.getItem('currentUser');
            // formData.areaID='';
            this.editWaitingArea(formData);
          }
      } else {
          args.cancel = true;
      }
    }
    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].areaID;
     this.deleteWaitingArea(id);
    }
  }

  actionComplete(args: DialogEditEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      if(args.requestType === 'add'){
        args!.dialog!.header="New WaitingArea" ;
        }
        else{
          args!.dialog!.header="Edit WaitingArea" ;
        }
        if (Browser.isDevice) {
            args!.dialog!.height = window.innerHeight - 90 + 'px';
            (<Dialog>args.dialog).dataBind();
        }
    }
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      areaID: new FormControl({ value: data.areaID, disabled: true }), // Read-only 
      name: new FormControl(data.name,Validators.required),
      yardID: new FormControl(data.yardID,Validators.required),
      active:new FormControl(data.active)
    });
  }

  addWaitingArea(formData: any) {
    this.spinner.show();
    this.service
      .createWaitingArea(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result.status == true) {
          this.spinner.hide();
          Swal.fire('WaitingArea', result.messageContent, 'success');
          this.loadTableData();
        } else {
          this.spinner.hide();
          Swal.fire('WaitingArea', result.messageContent, 'error');
        }
      });
  }

  editWaitingArea(formData: any) {
    this.spinner.show();
    this.service
      .updateWaitingArea(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.loadTableData();
        if (result.status == true) {
          this.showSuccess(result.messageContent);
        } else {
          this.spinner.hide();
          Swal.fire('WaitingArea', result.messageContent, 'error');
        }
      });
  }

  deleteWaitingArea(id: any) {
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
          .deleteWaitingArea(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
              Swal.fire('WaitingArea', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  validateControl(controlName: string) {
    const control = this.wAreaForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('WaitingArea', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('WaitingArea', error.statusText, 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport({
        fileName:'WaitingAreaReport.xlsx',
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
