import { Component, ViewChild } from '@angular/core';
import { EditSettingsModel, GridComponent, GridLine, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { MasterModule } from '../../master.module';
import { TransporterService } from './transporter.service';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'app-transporter',
  standalone: true,
  imports: [MasterModule],
  templateUrl: './transporter.component.html',
  styleUrl: './transporter.component.scss'
})
export class TransporterComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowEditing: false, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = [
  { text: "Add", tooltipText: "Add", id: "add" },
  { text: "Edit", tooltipText: "Edit", prefixIcon: "e-edit", id: "edit" },
  { text: "IsBlack", tooltipText: "IsBlack", prefixIcon: "e-circle-check", id: "isblack" },
  'Delete','Search'];
  lines: GridLine = 'Both';
  submitClicked: boolean = false;
  public data: Object[];
  blackForm:any;
  isBlack: boolean=true;
  isShow: boolean=true;
  @ViewChild('Grid') public grid: GridComponent;
  @ViewChild('blackModal')blackModal: DialogComponent;
  Dialog: any;

  constructor(
    private service: TransporterService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {}
  
  ngOnInit(){
    this.blackForm= new FormGroup({
      transporterID:new FormControl(''),
      isBlack: new FormControl(false),
      blackReason: new FormControl(''),
      blackDate: new FormControl(''),
      blackRemovedReason: new FormControl(''),
      blackRemovedDate: new FormControl(''),
    });
    this.loadTableData();
  }

  rowDataBound(args: any): void {
    if (args.row) {
      if (args.data.isBlack==true) {
        args.row.classList.add('not-Use');
      }
    }
  }

  loadTableData() {
    this.spinner.show();
    this.service.getTransporterList('All','All')
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
      this.grid.dataSource  = result;
      this.grid.searchSettings.operator = "equal";
      this.spinner.hide();
    });
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].transporterID;
      this.deleteTransporter(id);
    }
  }
  
  deleteTransporter(id: any) {
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
          .deleteTransporter(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
              Swal.fire('Transporter', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('Transporter', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Transporter', error.statusText, 'error');
  }

  openDialog () {
    this.blackModal.show();
  }

  hideDialog() {
    this.blackModal.hide();
  }

  onBlackFormSubmit() {
    this.spinner.show();
    const formData = this.blackForm.value;
    formData.isBlack=formData.isBlack?true:false;
    if(formData.isBlack==true){
      formData.blackRemovedDate=null;
      formData.blackRemovedReason=null;
      formData.blackReason=formData.blackReason
      formData.blackDate=moment(formData.blackDate).format('MM/DD/YYYY HH:mm:ss');
    }
    else{
      formData.blackDate=null;
      formData.blackReason=null;
      formData.blackRemovedReason=formData.blackRemovedReason;
      formData.blackRemovedDate=moment(formData.blackRemovedDate).format('MM/DD/YYYY HH:mm:ss');
    }
    this.hideDialog();
    console.log(formData)
    this.service
      .onBlackForm(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result.status == true) {
          Swal.fire('Transporter Black Form', result.messageContent,'success');
          this.loadTableData();
        } else {
          Swal.fire('Transporter Black Form', result.messageContent, 'error');
        }
      });
      this.spinner.hide();
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport();
    }
    else if (args.item.id ==='add'){
      this.router.navigate(["master/transporter-detail"], { queryParams: {id: null},skipLocationChange: true});
    }
    else if (args.item.id ==='edit' || args.item.id === 'isblack') {
      let selectedRecords: any[] = this.grid.getSelectedRecords();

      if (selectedRecords.length == 0) {
        Swal.fire('Transporter', "Please select one row!", 'warning');
      }
      else {
        var id: string = selectedRecords[0].transporterID;

        if (args.item.id === 'edit') {
            this.router.navigate(["master/transporter-detail"], { queryParams: { id: id }, skipLocationChange: true });
        }
        else if (args.item.id === 'isblack') {
          this.blackForm.reset();
            const isBlack = selectedRecords[0].isBlack;
            this.blackForm.controls['transporterID'].setValue(id);  // Set 'id' instead of 'transporterID'
            this.blackForm.controls['isBlack'].setValue(isBlack);

            if (isBlack == true) {
                this.isShow = false;
            }
            else {
                this.isShow = true;
            }
            this.blackModal.show();
        }
    }
   }
  }

}
