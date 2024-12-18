import { Component, ViewChild } from '@angular/core';
import { TmsOperationModule } from '../../tms-operation.module';
import { EditSettingsModel, GridComponent, GridLine, PageSettingsModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import moment from 'moment';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { TmsInCheckPorposalService } from './tms-in-check-proposal.service';

@Component({
  selector: 'app-tms-in-check-proposal',
  standalone: true,
  imports: [TmsOperationModule],
  templateUrl: './tms-in-check-proposal.component.html',
  styleUrl: './tms-in-check-proposal.component.scss'
})

export class TmsInCheckProposalComponent {
  pageSettings: PageSettingsModel = { pageSize: 50 };
  editSettings: EditSettingsModel = {  allowAdding: true, allowDeleting: true };
  toolbar: any[] = [{ text: "Add In Check", tooltipText: "Add In Check", prefixIcon: "e-icons e-add", id: "detail" },
  'Delete','ExcelExport','Search'];
  lines: GridLine = 'Both';
  optionForm: FormGroup;
  submitClicked: boolean = false;
  public formatfilter: any ="MM/dd/yyyy";
  deptTypeList:any[]=["CCA","Warehouse","Rail"];
  yardList:any[]=[];
  today : Date = new Date();
  public data: Object[];
  public placeholder: string = 'Select One';
  public mode?: string;
  public selectAllText: string| any;
  @ViewChild('Grid') public grid: GridComponent;

  constructor(
    private service: TmsInCheckPorposalService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {}

  ngOnInit(){
    // set the type of mode for checkbox to visualized the checkbox added in li element.
    this.mode = 'CheckBox';
    // set the select all text to MultiSelect checkbox label.
    this.selectAllText= 'Select All';
    //this.getLocationList();
    this.optionForm = new FormGroup({
      fromDate: new FormControl(sessionStorage.getItem("itmsfromDate")?sessionStorage.getItem("itmsfromDate"):this.today,Validators.required),
      toDate: new FormControl(sessionStorage.getItem("itmstoDate")?sessionStorage.getItem("itmstoDate"):this.today,Validators.required),
      deptType: new FormControl(sessionStorage.getItem("itmsdeptType")?sessionStorage.getItem("itmsdeptType").split(','):null,Validators.required),
      yardID: new FormControl(sessionStorage.getItem("itmsloc")?sessionStorage.getItem("itmsloc"):null,Validators.required),
    });

      this.getLocationList();
      this.loadTableData();
  }

  getLocationList() {
    this.spinner.show();
    this.service.getYardList('true')
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.yardList = result;
        this.optionForm.controls['yardID'].setValue(sessionStorage.getItem("itmsloc")?sessionStorage.getItem("itmsloc"):null);
        this.spinner.hide();
    });
  }


  loadTableData() {
   this.spinner.show();
   const formData = this.optionForm.value;
   const fromDate = moment(formData.fromDate).format('MM/DD/YYYY');
   const toDate =  moment(formData.toDate).format('MM/DD/YYYY');
    sessionStorage.setItem("itmsfromDate", fromDate);
    sessionStorage.setItem("itmstoDate", toDate);
    sessionStorage.setItem("itmsdeptType", formData.deptType);
    sessionStorage.setItem("itmsloc", formData.yardID);
    let dept:any ="";
    if(formData.deptType.length>0){
      dept = this.formatParams(formData.deptType);
    }
    if(fromDate&&toDate&&dept &&formData.yardID){
      this.service.getTMSProposalList(fromDate,toDate,formData.yardID,dept)
      .pipe(catchError((err) => of(this.showError(err))))
        .subscribe((result) => {
          this.grid.dataSource= result;
          this.grid.searchSettings.operator = "equal";
          this.spinner.hide();
      });
    }

  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
        this.submitClicked = false;
        this.router.navigate(["/tms-operation/proposal-form"]);
    }
    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].propNo;
      this.deleteProposal(id);
    }
  }

  formatParams(paramArray) {
    return paramArray.map(item => `'${item}'`).join(',');
  }


  deleteProposal(id: any) {
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'You will not be able to recover this data!',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#DD6B55',
    //   cancelButtonText: 'No, keep it',
    //   confirmButtonText: 'Yes, I am sure!',
    // }).then((response: any) => {
    //   if (response.value) {
    //     this.spinner.show();
    //     this.service
    //       .deleteProposal(id)
    //       .pipe(catchError((err) => of(this.showError(err))))
    //       .subscribe((result) => {
    //         if (result.status == true) {
    //           this.showSuccess(result.messageContent);
    //           this.loadTableData();
    //         } else {
    //           this.spinner.hide();
    //           Swal.fire('TMS Proposal', result.messageContent, 'error');
    //         }
    //       });
    //   } else if (response.dismiss === Swal.DismissReason.cancel) {
    //     Swal.close();
    //   }
    // });
  }


  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('TMS Proposal', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('TMS Proposal', error.statusText, 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport({
        fileName:'Proposal.xlsx',
     });
    }

    if (args.item.id === 'detail') {
      let selectedRecords: any[] = this.grid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        Swal.fire('TMS Proposal', "Please select one row!", 'warning');
      }

      else {
        const id = selectedRecords[0].propNo;
        if (args.item.id === 'detail')
        {
          this.router.navigate(["/tms-operation/tms-in-check-proposal-doc"], { queryParams: { poNo: id, id: null}});
          return;
        }

      }
    }
  }

}
