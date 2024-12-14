import { Component, ViewChild } from '@angular/core';
import { EditSettingsModel, ExcelQueryCellInfoEventArgs, GridComponent, GridLine, PageSettingsModel, SaveEventArgs, Toolbar } from '@syncfusion/ej2-angular-grids';
import { ProposalService } from '../proposal/proposal.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { TmsOperationModule } from '../../tms-operation.module';
import { FormControl, FormGroup } from '@angular/forms';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-proposal-detail',
  standalone: true,
  imports: [TmsOperationModule],
  templateUrl: './proposal-detail.component.html',
  styleUrl: './proposal-detail.component.scss'
})
export class ProposalDetailComponent {
  pageSettings: PageSettingsModel = { pageSize: 50 };
  editSettings: EditSettingsModel = { allowEditing: false, allowAdding: true, allowDeleting: true };
  toolbar: any[] = ['Delete','ExcelExport','Search'];
  lines: GridLine = 'Both';

  id:string;
  proposalDetailForm:any=[];
  @ViewChild('Grid') public grid: GridComponent;
  constructor(
    private service: ProposalService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,

  ) {}
  ngOnInit(){
    this.id = this.route.snapshot.queryParams['id'];

    if(this.id!=null){
      this.loadTableData(this.id);
    }
  }

  loadTableData(id:string){
    this.service.getProposalDetailList(id)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.grid.dataSource= result;
        this.spinner.hide();
    });
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      inRegNo:new FormControl(data.inRegNo),
      docCode:new FormControl(data.docCode),
      docName: new FormControl(data.docName),
      checkStatus: new FormControl(data.checkStatus),
    });
  }

    actionBegin(args: SaveEventArgs): void {
      if (args.requestType === 'delete') {
        args.cancel = true;
        const data = args.data as any[];
        const id = data[0].propNo;
        const truckNo=data[0].truckNo;
        this.deleteProposalDetail(id,truckNo);
      }
    }


    deleteProposalDetail(id: any,truckNo:any) {
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
            .deleteProposalDetail(id,truckNo)
            .pipe(catchError((err) => of(this.showError(err))))
            .subscribe((result) => {
              if (result.status == true) {
                this.showSuccess(result.messageContent);
                this.loadTableData(this.id);
              } else {
                this.spinner.hide();
                Swal.fire('TMS Proposal Detail', result.messageContent, 'error');
              }
            });
        } else if (response.dismiss === Swal.DismissReason.cancel) {
          Swal.close();
        }
      });
    }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport({
        fileName:'ProposalDetail.xlsx',
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

  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('TMS Proposal Detail', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('TMS Proposal Detail', error.statusText, 'error');
  }


}
