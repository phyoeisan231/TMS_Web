import { Component, ViewChild } from '@angular/core';
import { EditSettingsModel, GridComponent, GridLine, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { MasterModule } from '../../master.module';
import { TruckService } from './truck.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import * as moment from 'moment';
import { Console } from 'console';

@Component({
  selector: 'app-truck',
  standalone: true,
  imports: [MasterModule],
  templateUrl: './truck.component.html',
  styleUrl: './truck.component.scss'
})
export class TruckComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowEditing: false, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = [
  { text: "Add", tooltipText: "Add", id: "add" },
  { text: "Edit", tooltipText: "Edit", prefixIcon: "e-edit", id: "edit" },
  { text: "IsBlack", tooltipText: "IsBlack", prefixIcon: "e-circle-check", id: "isblack" },
  'Delete','Search'];
  lines: GridLine = 'Both';
  truckForm: any;
  truckTypeList: any[]=[];
  truckList: any[]=[];
  public format: any = {type:"date", format:"dd/MM/yyyy"};
  blackForm:any;
  isBlack: boolean=true;
  isShow: boolean=true;
  today : Date = new Date();
  submitClicked: boolean = false;
  public data: Object[];
  @ViewChild('Grid') public grid: GridComponent;
  @ViewChild('blackModal')blackModal: DialogComponent;
  Dialog: any;
  constructor(
    private service: TruckService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {}
  
  ngOnInit(){
    this.blackForm= new FormGroup({
      vehicleRegNo: new FormControl(''),
      isBlack: new FormControl(false),
      blackReason: new FormControl(''),
      blackDate: new FormControl(this.today),
      blackRemovedReason: new FormControl(''),
      blackRemovedDate: new FormControl(this.today),
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
    this.service.getTruckList()
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
      this.grid.dataSource  = result;
      this.spinner.hide();
    });
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].vehicleRegNo;
      this.deleteTruck(id);
    }
  }

  deleteTruck(id: any) {
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
          .deleteTruck(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
              Swal.fire('Truck', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
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
          Swal.fire('Truck Black Form', result.messageContent,'success');
          this.loadTableData();
        } else {
          Swal.fire('Truck Black Form', result.messageContent, 'error');
        }
      });
      this.spinner.hide();
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('Truck', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Truck', error.statusText, 'error');
  }

  validateControl(controlName: string) {
    const control = this.truckForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }

  
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.text === 'Excel Export') {
        this.grid.excelExport();
    }
    else if (args.item.id === 'add') {
        this.router.navigate(["master/truck-detail"], { queryParams: { id: null }, skipLocationChange: true });
    }
    else if (args.item.id === 'edit' || args.item.id === 'isblack') {
        let selectedRecords: any[] = this.grid.getSelectedRecords();

        if (selectedRecords.length == 0) {
            Swal.fire('Truck', "Please select one row!", 'warning');
        }
        else {
            var id: string = selectedRecords[0].vehicleRegNo;

            if (args.item.id === 'edit') {
                this.router.navigate(["master/truck-detail"], { queryParams: { id: id }, skipLocationChange: true });
            }
            else if (args.item.id === 'isblack') {
              this.blackForm.reset();
                const isBlack = selectedRecords[0].isBlack;
                this.blackForm.controls['vehicleRegNo'].setValue(id);  // Set 'id' instead of 'vehicleRegNo'
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
