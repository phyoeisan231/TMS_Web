import { Component, ViewChild } from '@angular/core';
import { EditSettingsModel, GridComponent, GridLine, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { TrailerService } from './trailer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { MasterModule } from '../../master.module';

@Component({
  selector: 'app-trailer',
  standalone: true,
  imports: [MasterModule],
  templateUrl: './trailer.component.html',
  styleUrl: './trailer.component.scss'
})
export class TrailerComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowEditing: false, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = [
  { text: "Add", tooltipText: "Add", id: "add" },
  { text: "Edit", tooltipText: "Edit", prefixIcon: "e-edit", id: "edit" },
  'Delete','Search'];
  lines: GridLine = 'Both';
  submitClicked: boolean = false;
  public data: Object[];
  @ViewChild('Grid') public grid: GridComponent;
  constructor(
    private service: TrailerService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {}
  
  ngOnInit(){
    this.loadTableData();
  }

  loadTableData() {
    this.spinner.show();
    this.service.getTrailerList()
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
      this.deleteTrailer(id);
    }
  }

  deleteTrailer(id: any) {
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
          .deleteTrailer(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
              Swal.fire('Trailer', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('Trailer', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Trailer', error.statusText, 'error');
  }
  
  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport();
    }
    else if (args.item.id === 'add') {
      this.router.navigate(["master/trailer-detail"], { queryParams: { id: null }, skipLocationChange: true });
    }
    else if (args.item.id ==='edit') {
      let selectedRecords: any[] = this.grid.getSelectedRecords();

      if (selectedRecords.length == 0) {
        Swal.fire('Trailer', "Please select one row!", 'warning');
      }
      else {
        var id: string=selectedRecords[0].vehicleRegNo;         
       if(args.item.id === 'edit'){
        this.router.navigate(["master/trailer-detail"], { queryParams: {id: id},skipLocationChange: true});
       }
        return;
      }
   }
  }

}