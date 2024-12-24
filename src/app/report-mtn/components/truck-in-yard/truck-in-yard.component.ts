import { Component, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { AggregateService, EditSettingsModel, GridComponent, GridLine, GroupService, GroupSettingsModel, PageSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import moment from 'moment';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ReportMtnModule } from '../../report-mtn.module';
import { TruckInYardService } from './truck-in-yard.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-truck-in-yard',
  standalone: true,
  imports: [ReportMtnModule],
  templateUrl: './truck-in-yard.component.html',
  styleUrl: './truck-in-yard.component.scss',
  providers: [GroupService,AggregateService]
})
export class TruckInYardComponent {
  pageSettings: PageSettingsModel = { pageSize: 50 };
  editSettings: EditSettingsModel = { allowEditing: false, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = ['ExcelExport','Search'];
  lines: GridLine = 'Both';
  optionForm: FormGroup;
  submitClicked: boolean = false;
  public formatfilter: any ="MM/dd/yyyy";
  yardList:[]=[];
  endDate : Date = new Date();
  today : Date = new Date();
  statusList:string[]=['In(Check)','In','In(Weight)','Operation','Out(Weight)','Out(Check)','Out'];
  
  public toolbarOptions?: ToolbarItems[];
  public groupOptions:GroupSettingsModel={showDropArea:false,columns:['truckVehicleRegNo']};

  public data1?:Object[];
  public data2?:Object[];
  public data3?:Object[];
  public data4?:Object[];  public data5?:Object[];  public data6?:Object[];  public data7?:Object[];

  public mode?: string;
  isTab1:boolean=true;
  isTab2:boolean=false;
  isTab3:boolean=false;
  isTab4:boolean=false;
  isTab5:boolean=false;
  isTab6:boolean=false;
  isTab7:boolean=false;
  public selectAllText: string| any;

  @ViewChild('grid1') public grid1?: GridComponent;
  @ViewChild('grid2') public grid2: GridComponent;
  @ViewChild('grid3') public grid3: GridComponent;
  @ViewChild('grid4') public grid4: GridComponent; 
  @ViewChild('grid5') public grid5: GridComponent;
  @ViewChild('grid6') public grid6: GridComponent;
  @ViewChild('grid7') public grid7: GridComponent;
  // end multi file upload
  constructor(
    private service: TruckInYardService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {}

  ngOnInit(){
    this.mode = 'CheckBox';
    this.toolbarOptions = ['ExcelExport'];
    
    this.groupOptions = { showDropArea: false, columns: ['groupName'] };
    this.getLocationList();
    this.optionForm = new FormGroup({
      // fromDate: new FormControl(sessionStorage.getItem("tyfromDate")?sessionStorage.getItem("tyfromDate"):this.today,Validators.required),
      // toDate: new FormControl(sessionStorage.getItem("tytoDate")?sessionStorage.getItem("tytoDate"):this.today,Validators.required),
      yardID: new FormControl(sessionStorage.getItem("tyloc")?sessionStorage.getItem("tyloc").split(','):null,Validators.required),
      status: new FormControl(sessionStorage.getItem("tytatus")?sessionStorage.getItem("tstatus").split(','):null),

    });
  }
  getLocationList() {
    this.spinner.show();
    this.service.getYardList('true')
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.yardList = result;
        this.optionForm.controls['yardID'].setValue(sessionStorage.getItem("tyloc")?sessionStorage.getItem("tyloc").split(','):null);
        this.spinner.hide();
    });
  }

// getBadgeColor(status: string): string {
//     switch (status) {
//         case 'In(Check)':
//             return 'rgb(3, 252, 173)'; //Aqua Green
//         case 'In':
//             return 'rgb(65, 145, 120)'; //Teal Green Purple 65, 145, 120 106, 90, 205
//         case 'In(Weight)':
//             return 'rgb(61, 155, 227)'; // Sky Blue 
//         case 'Operation':
//             return 'rgb(235, 121, 7)'; //Bright Orange
//         case 'Out(Weight)':
//             return 'rgb(39, 204, 39)'; //Lime Green
//         case 'Out(Check)':
//             return 'rgba(152, 75, 191)'; //Medium Purple or Vivid Orchid
//         case 'Out':
//             return 'rgb(140, 140, 140)'; // Gray
//         default:
//             return 'rgb(199, 73, 73)'; // Red for unknown status
//     }
// }
getBadgeColor(status: string): string {
  switch (status) {
    case 'In(Check)':
      return ' rgb(248, 144, 32)'; // orange
    case 'In':
      return ' rgb(171, 127, 195)'; // Purple
    case 'In(Weight)':
      return '#d83ad8'; // Orchid
    case 'Operation':
      return '#0dcaf0'; // info
    case 'Out(Weight)':
      return 'rgb(23, 117, 223)'; // primary
    case 'Out(Check)':
      return 'rgba(52, 187, 52, 0.8)'; // Medium Green
    case 'Out':
      return 'rgb(23, 106, 23)'; // Green
    default:
      return 'rgb(199, 73, 73)'; // Red for unknown status
  }
 }

   InCheck(){
    document.getElementById("base-tab1").style.color='#2793f1';
    document.getElementById("base-tab2").style.color='#000';
    document.getElementById("base-tab3").style.color='#000';
    document.getElementById("base-tab4").style.color='#000';
    document.getElementById("base-tab5").style.color='#000';
    document.getElementById("base-tab6").style.color='#000';
    document.getElementById("base-tab7").style.color='#000';
    this.isTab1=true;
    this.isTab2=false;
    this.isTab3=false;
    this.isTab4=false;
    this.isTab5=false;
    this.isTab6=false;
    this.isTab7=false;
   }

   IN(){
    document.getElementById("base-tab2").style.color='#2793f1';
    document.getElementById("base-tab1").style.color='#000';
    document.getElementById("base-tab3").style.color='#000';
    document.getElementById("base-tab4").style.color='#000';
    document.getElementById("base-tab5").style.color='#000';
    document.getElementById("base-tab6").style.color='#000';
    document.getElementById("base-tab7").style.color='#000';
    this.isTab2=true;
    this.isTab1=false;
    this.isTab3=false;
    this.isTab4=false;
    this.isTab5=false;
    this.isTab6=false;
    this.isTab7=false;
  }

  InWeight(){
    document.getElementById("base-tab3").style.color='#2793f1';
    document.getElementById("base-tab1").style.color='#000';
    document.getElementById("base-tab2").style.color='#000';
    document.getElementById("base-tab4").style.color='#000';
    document.getElementById("base-tab5").style.color='#000';
    document.getElementById("base-tab6").style.color='#000';
    document.getElementById("base-tab7").style.color='#000';
    this.isTab3=true;
    this.isTab1=false;
    this.isTab2=false;
    this.isTab4=false;
    this.isTab5=false;
    this.isTab6=false;
    this.isTab7=false;
  }

  Operation(){
    document.getElementById("base-tab4").style.color='#2793f1';
    document.getElementById("base-tab3").style.color='#000';
    document.getElementById("base-tab1").style.color='#000';
    document.getElementById("base-tab2").style.color='#000';
    document.getElementById("base-tab5").style.color='#000';
    document.getElementById("base-tab6").style.color='#000';
    document.getElementById("base-tab7").style.color='#000';
    this.isTab4=true;
    this.isTab3=false;
    this.isTab1=false;
    this.isTab2=false;
    this.isTab5=false;
    this.isTab6=false;
    this.isTab7=false;
  }

  OutWeight(){
    document.getElementById("base-tab5").style.color='#2793f1';
    document.getElementById("base-tab1").style.color='#000';
    document.getElementById("base-tab2").style.color='#000';
    document.getElementById("base-tab4").style.color='#000';
    document.getElementById("base-tab3").style.color='#000';
    document.getElementById("base-tab6").style.color='#000';
    document.getElementById("base-tab7").style.color='#000';
    this.isTab5=true;
    this.isTab1=false;
    this.isTab2=false;
    this.isTab4=false;
    this.isTab3=false;
    this.isTab6=false;
    this.isTab7=false;
  }

  OutCheck(){
    document.getElementById("base-tab6").style.color='#2793f1';
    document.getElementById("base-tab1").style.color='#000';
    document.getElementById("base-tab2").style.color='#000';
    document.getElementById("base-tab3").style.color='#000';
    document.getElementById("base-tab4").style.color='#000';
    document.getElementById("base-tab5").style.color='#000';
    document.getElementById("base-tab7").style.color='#000';
    this.isTab6=true;
    this.isTab1=false;
    this.isTab2=false;
    this.isTab3=false;
    this.isTab4=false;
    this.isTab5=false;
    this.isTab7=false;
  }

  Out(){
    document.getElementById("base-tab7").style.color='#2793f1';
    document.getElementById("base-tab1").style.color='#000';
    document.getElementById("base-tab2").style.color='#000';
    document.getElementById("base-tab3").style.color='#000';
    document.getElementById("base-tab4").style.color='#000';
    document.getElementById("base-tab5").style.color='#000';
    document.getElementById("base-tab6").style.color='#000';
    this.isTab7=true;
    this.isTab1=false;
    this.isTab2=false;
    this.isTab3=false;
    this.isTab4=false;
    this.isTab5=false;
    this.isTab6=false;
  }

  public aggregates = [
    {
      columns: [
        {
          type: ['count'],
          field: 'truckVehicleRegNo',
          columnName: 'truckVehicleRegNo',
          // format: 'C2',
          footerTemplate: 'Total Trucks: ${count}',
        },
      ],
    },
  ];


   loadTableData() {
    this.getTruckInCheck();
    this.getTruckIn();
    this.getTruckInWeight();
    this.getTruckOperation();
    this.getTruckOutWeight()
    this.getTruckOutCheck();
    this.getTruckOut();
  }

  getTruckInCheck(){
    this.spinner.show();
    const formData = this.optionForm.value;
     sessionStorage.setItem('tyloc',formData.yardID);
     this.service.getTruckInCheckList(formData.yardID)
     .pipe(catchError((err) => of(this.showError(err))))
       .subscribe((result) => {
         this.data1= result;
         this.grid1.searchSettings.operator = "equal";
         this.grid1.refresh();
         this.spinner.hide();
     });
  }
  
  getTruckIn(){
    this.spinner.show();
    const formData = this.optionForm.value;
     sessionStorage.setItem('tyloc',formData.yardID);
     this.service.GetTruckInList(formData.yardID)
     .pipe(catchError((err) => of(this.showError(err))))
       .subscribe((result) => {
        // (this.grid2 as GridComponent).getHeaderContent().append((this.grid2 as GridComponent).getFooterContent());
         this.data2= result;
        //  this.grid2.dataSource=result;
         this.grid2.searchSettings.operator = "equal";
         this.grid2.refresh();
         this.spinner.hide();
     });
  }

  getTruckInWeight(){
    this.spinner.show();
    const formData = this.optionForm.value;
     sessionStorage.setItem('tyloc',formData.yardID);
     this.service.GetTruckInWeightList(formData.yardID)
     .pipe(catchError((err) => of(this.showError(err))))
       .subscribe((result) => {
         this.data3= result;
         this.grid3.searchSettings.operator = "equal";
         this.grid3.refresh();
         this.spinner.hide();
     });
  }

  getTruckOperation(){
    this.spinner.show();
    const formData = this.optionForm.value;
     sessionStorage.setItem('tyloc',formData.yardID);
     this.service.GetTruckOperationList(formData.yardID)
     .pipe(catchError((err) => of(this.showError(err))))
       .subscribe((result) => {
         this.data4= result;
         this.grid4.searchSettings.operator = "equal";
         this.grid4.refresh();
         this.spinner.hide();
     });
  }

  getTruckOutWeight(){
    this.spinner.show();
    const formData = this.optionForm.value;
     sessionStorage.setItem('tyloc',formData.yardID);
     this.service.GetTruckOutWeightList(formData.yardID)
     .pipe(catchError((err) => of(this.showError(err))))
       .subscribe((result) => {
         this.data5= result;
         this.grid5.searchSettings.operator = "equal";
         this.grid5.refresh();
         this.spinner.hide();
     });
  }

  getTruckOutCheck(){
    this.spinner.show();
    const formData = this.optionForm.value;
     sessionStorage.setItem('tyloc',formData.yardID);
     this.service.GetTruckOutCheckList(formData.yardID)
     .pipe(catchError((err) => of(this.showError(err))))
       .subscribe((result) => {
         this.data6= result;
         this.grid6.searchSettings.operator = "equal";
         this.grid6.refresh();
         this.spinner.hide();
     });
  }

  getTruckOut(){
    this.spinner.show();
    const formData = this.optionForm.value;
     sessionStorage.setItem('tyloc',formData.yardID);
     this.service.GetTruckOutList(formData.yardID)
     .pipe(catchError((err) => of(this.showError(err))))
       .subscribe((result) => {
         this.data7= result;
         this.grid7.searchSettings.operator = "equal";
         this.grid7.refresh();
         this.spinner.hide();
     });
  }

  formatParams(paramArray) {
    return paramArray.map(item => `'${item}'`).join(',');
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('Truck in Yard', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Truck in Yard', error.statusText, 'error');
  }

  toolbarClick1(args: ClickEventArgs): void {
    if (args.item.id === 'Grid_excelexport') {
      this.grid1.excelExport({
        fileName:'Truck_In(Check)Report.xlsx',
        header: {
          headerRows: 2,
          rows: [
              {
                  cells: [
                    {
                      colSpan: 14, value: 'Truck In(Check) Report',
                      style: { fontColor: '#000000', fontSize: 15, hAlign: 'Center', bold: true,underline:true}
                  }
                ]
              },
  
              {
                cells: [{
                    colSpan: 14, value:'',
  
                },
  
            ]
  
            },
          ]
  
          },
        });
    }
   }
  
   toolbarClick2(args: ClickEventArgs): void {
    if (args.item.id === 'Grid_excelexport') {
      this.grid2.excelExport({
        fileName:'Truck_(IN).xlsx',
        header: {
          headerRows: 2,
          rows: [
              {
                  cells: [
                    {
                      colSpan: 14, value: 'Truck in (IN)',
                      style: { fontColor: '#000000', fontSize: 15, hAlign: 'Center', bold: true,underline:true}
                  }
                ]
              },
  
              {
                cells: [{
                    colSpan: 14, value:'',
  
                },
  
            ]
  
            },
          ]
  
          },
        });
    }
   }
  
   toolbarClick3(args: ClickEventArgs): void {
    if (args.item.id === 'Grid_excelexport') {
      this.grid3.excelExport({
        fileName:'Truck_In(Weight).xlsx',
        header: {
          headerRows: 2,
          rows: [
              {
                  cells: [
                    {
                      colSpan: 16, value: 'Truck in In(Weight)',
                      style: { fontColor: '#000000', fontSize: 15, hAlign: 'Center', bold: true,underline:true}
                  }
                ]
              },
  
              {
                cells: [{
                    colSpan: 16, value:'',
  
                },
  
            ]
  
            },
          ]
  
          },
        });
    }
   }
  
   toolbarClick4(args: ClickEventArgs): void {
    if (args.item.id === 'Grid_excelexport') {
      this.grid4.excelExport({
        fileName:'Truck_Operation.xlsx',
        header: {
          headerRows: 2,
          rows: [
              {
                  cells: [
                    {
                      colSpan: 17, value: 'Truck in Operation',
                      style: { fontColor: '#000000', fontSize: 15, hAlign: 'Center', bold: true,underline:true}
                  }
                ]
              },
  
              {
                cells: [{
                    colSpan: 17, value:'',
  
                },
  
            ]
  
            },
          ]
  
          },
        });
    }
   }

   toolbarClick5(args: ClickEventArgs): void {
    if (args.item.id === 'Grid_excelexport') {
      this.grid5.excelExport({
        fileName:'Truck_Out(Weight).xlsx',
        header: {
          headerRows: 2,
          rows: [
              {
                  cells: [
                    {
                      colSpan: 16, value: 'Truck in Out(Weight)',
                      style: { fontColor: '#000000', fontSize: 15, hAlign: 'Center', bold: true,underline:true}
                  }
                ]
              },
  
              {
                cells: [{
                    colSpan: 16, value:'',
  
                },
  
            ]
  
            },
          ]
  
          },
        });
    }
   }

   toolbarClick6(args: ClickEventArgs): void {
    if (args.item.id === 'Grid_excelexport') {
      this.grid6.excelExport({
        fileName:'Truck_Out(Check).xlsx',
        header: {
          headerRows: 2,
          rows: [
              {
                  cells: [
                    {
                      colSpan: 14, value: 'Truck in Out(Check)',
                      style: { fontColor: '#000000', fontSize: 15, hAlign: 'Center', bold: true,underline:true}
                  }
                ]
              },
  
              {
                cells: [{
                    colSpan: 14, value:'',
  
                },
  
            ]
  
            },
          ]
  
          },
        });
    }
   }

   toolbarClick7(args: ClickEventArgs): void {
    if (args.item.id === 'Grid_excelexport') {
      this.grid7.excelExport({
        fileName:'Truck_Out.xlsx',
        header: {
          headerRows: 2,
          rows: [
              {
                  cells: [
                    {
                      colSpan: 14, value: 'Truck in (Out)',
                      style: { fontColor: '#000000', fontSize: 15, hAlign: 'Center', bold: true,underline:true}
                  }
                ]
              },
  
              {
                cells: [{
                    colSpan: 14, value:'',
  
                },
  
            ]
  
            },
          ]
  
          },
        });
    }
   }

}
