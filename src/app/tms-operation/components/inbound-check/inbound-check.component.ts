import { Component } from '@angular/core';
import { TmsOperationModule } from '../../tms-operation.module';

@Component({
  selector: 'app-inbound-check',
  standalone: true,
  imports: [TmsOperationModule],
  templateUrl: './inbound-check.component.html',
  styleUrl: './inbound-check.component.scss'
})
export class InboundCheckComponent {

}
