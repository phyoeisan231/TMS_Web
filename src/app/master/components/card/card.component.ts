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
import { CardService } from './card.service';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MasterModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = ['Add','Edit','Delete','ExcelExport','Search'];
  lines: GridLine = 'Both';
  cardForm: any;
  id: string;
  lblText:string;
  yardList:any[]=[];
  cardList:any[];
  groupNameList:any[]=["ICD","TMS","Others"];
  submitClicked: boolean = false;
  public data: Object[];
  formatfilter:string='dd-MMM-yyyy';
  today : Date = new Date();
  @ViewChild('Grid') public grid: GridComponent;
  constructor(
    private service: CardService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(){
    this.loadTableData();
  }

  rowDataBound(args: any): void {
    if (args.row) {
      if (args.data.isUse==true) {
        args.row.classList.add('not-Use');
      }
    }
  }

  loadTableData() {
    this.spinner.show();
    forkJoin({
      cards: this.service.getCardList('All').pipe(catchError((err) => of(this.showError(err)))),
      yardList: this.service.getYardList('true').pipe(catchError((err) => of([]))) // Ensure no error is thrown for yardList
    }).subscribe({
      next: ({cards,yardList }) => {
        this.cardList=cards;
        this.grid.dataSource = this.cardList;
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
      this.cardForm = this.createFormGroup(args.rowData);
    }
    else if(args.requestType === 'beginEdit'){
      this.submitClicked = false;
      this.cardForm = this.createFormGroup(args.rowData);
    }
    if (args.requestType === 'save') {
      this.submitClicked = true;
      if (this.cardForm.valid) {
          let formData = this.cardForm.getRawValue();
          if (args.action === 'add') {
            formData.createdUser = localStorage.getItem('currentUser');
            formData.cardNo='';
            this.addCard(formData);
          }
          else {
            formData.updatedUser = localStorage.getItem('currentUser');
            this.editCard(formData);
          }
      } else {
          args.cancel = true;
      }
    }
    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].cardNo;
     this.deleteCard(id);
    }
  }

  actionComplete(args: DialogEditEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      if(args.requestType === 'add'){
        args!.dialog!.header="New Card" ;
        }
        else{
          args!.dialog!.header="Edit Card" ;
        }
        if (Browser.isDevice) {
            args!.dialog!.height = window.innerHeight - 90 + 'px';
            (<Dialog>args.dialog).dataBind();
        }
    }
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      cardNo: new FormControl({ value: data.cardNo, disabled: true }), // Read-only
      yardID: new FormControl(data.yardID,Validators.required),
      groupName: new FormControl(data.groupName,Validators.required),
      active:new FormControl(data.active),
      isUse:new FormControl(data.isUse)
    });
  }

  addCard(formData: any) {
    this.spinner.show();
    formData.active=true;
    formData.isUse=true;
    this.service
      .createCard(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result.status == true) {
          this.spinner.hide();
          Swal.fire('Card', result.messageContent, 'success');
          this.loadTableData();
        } else {
          this.spinner.hide();
          this.grid.dataSource=this.cardList.filter(x=>x.cardNo!=undefined);
          Swal.fire('Card', result.messageContent, 'error');
        }
      });
  }

  editCard(formData: any) {
    this.spinner.show();
    formData.active=formData.active?true:false;
    formData.isUse=formData.isUse?true:false;

    this.service
      .updateCard(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.loadTableData();
        if (result.status == true) {
          this.showSuccess(result.messageContent);
        } else {
          this.spinner.hide();
          Swal.fire('Card', result.messageContent, 'error');
        }
      });
  }

  deleteCard(id: any) {
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
          .deleteCard(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
              Swal.fire('Card', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  validateControl(controlName: string) {
    const control = this.cardForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('Card', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Card', error.statusText, 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport({
        fileName:'CardReport.xlsx',
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
