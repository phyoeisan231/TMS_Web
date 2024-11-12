import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AggregateService, EditService, ExcelExportService, GridModule, PageService, ResizeService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { HttpClientModule } from '@angular/common/http';
import { NumericTextBoxAllModule, TextBoxModule} from '@syncfusion/ej2-angular-inputs';
import { CheckBoxSelectionService, DropDownListAllModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { DatePickerModule, TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { SharedModule } from '../theme/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [],
  // imports: [
  //   CommonModule,
  //   FormsModule,
  //   ReactiveFormsModule,
  //   NgbModule,
  //   NgbNavModule,
  //   NgScrollbarModule,
  //   HttpClientModule,
  //   NgbTooltipModule,
  //   NgbTooltipModule,
  //   GridModule,
  //   DropDownListAllModule,
  //   NumericTextBoxAllModule,
  //   DatePickerModule,
  //   TextBoxModule,
  //   DialogModule,
  //   MultiSelectModule,
  //   TimePickerModule,
  //   CheckBoxModule,
  //   SharedModule,
  //   NgxSpinnerModule
  // ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbNavModule,
    NgScrollbarModule,
    HttpClientModule,
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
export class MasterModule { }
