import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregateService, EditService,ExcelExportService, GridModule, PageService, ResizeService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { CheckBoxSelectionService, DropDownListAllModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NumericTextBoxAllModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DatePickerModule, TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { SharedModule } from '../theme/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbNavModule,
    NgScrollbarModule,
    NgbTooltipModule,
    NgbTooltipModule,
    GridModule,
    DropDownListAllModule,
    NumericTextBoxAllModule,
    DatePickerModule,
    TextBoxModule,
    DialogModule,
    MultiSelectModule,
    TimePickerModule,
    CheckBoxModule,
    SharedModule,
    NgxSpinnerModule
  ],
  providers: [PageService,ResizeService, SortService, EditService, ToolbarService,ExcelExportService,AggregateService,CheckBoxSelectionService]
})
export class ReportMtnModule { }
