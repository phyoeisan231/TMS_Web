import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, last, of } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { MasterModule } from '../../master.module';
import { error } from 'console';
import { TransporterDetailService } from './transporter-detail.service';
@Component({
  selector: 'app-transporter-detail',
  standalone: true,
  imports: [MasterModule],
  templateUrl: './transporter-detail.component.html',
  styleUrl: './transporter-detail.component.scss'
})
export class TransporterDetailComponent{
  transForm: FormGroup;
  id: string;
  breadCrumbItems: Array<{}>;
  // breadCrumbItems: Array<{ label: string, routerLink?: string, active?: boolean }>;
  isAdd: boolean = true;
  transTypesList:any[]=[];
  formatfilter:string='dd-MMM-yyyy';
  today : Date = new Date();


  constructor(
    private _sanitizer: DomSanitizer,
    private service: TransporterDetailService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

 
  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Transporter Detail', routerLink: '/transporter-detail', active: false },
    { label: 'Add New Transporter', active: true }];
    this.id = this.route.snapshot.queryParams['id'];
    this.transForm = new FormGroup({
      transporterCode: new FormControl({value:this.id,disabled:!!this.id },Validators.required),
      transporterName: new FormControl('',Validators.required),
      address: new FormControl('',Validators.required),
      contactNo: new FormControl('',Validators.required),
      email: new FormControl('', [Validators.email]),
      contactPerson:new FormControl('',Validators.required),
      transporterType: new FormControl('',Validators.required),
      remarks:new FormControl(''),
      active: new FormControl(false),
      // isBlack:new FormControl(false),
      // blackReason:new FormControl(''),
      // blackDate:new FormControl(null),
      // blackRemovedDate: new FormControl(null),
      // blackRemovedReason:new FormControl(''),
    });
    if (this.id) {
      this.getTransporterById();
      this.isAdd=false;
    }
    this.service.getTransporterTypes().subscribe({
      next: (types) => {
        console.log("Transporter Types Loaded:", types); // Check if data is coming through
        this.transTypesList = types;
      },
      error: (error) => {
        console.error('Error loading transporter types', error);
      }
    });
  }

  navigateToTransporter() {
    this.router.navigate(['master/transporter']);
  }

  getTransporterById() {
    this.spinner.show();
    this.service.getTransporterId(this.id)
   .pipe(catchError((err) => of(this.showError(err))))
     .subscribe((result) => {
      this.transForm.controls['transporterCode'].setValue(result.transporterCode);
      this.transForm.controls['transporterName'].setValue(result.transporterName);
      this.transForm.controls['address'].setValue(result.address);
      this.transForm.controls['contactNo'].setValue(result.contactNo);
      this.transForm.controls['email'].setValue(result.email);
      this.transForm.controls['contactPerson'].setValue(result.contactPerson);
      this.transForm.controls['transporterType'].setValue(result.transporterType);
      this.transForm.controls['remarks'].setValue(result.remarks);
      this.transForm.controls['active'].setValue(result.active);
      // this.transForm.controls['isBlack'].setValue(result.isBlack);
      // this.transForm.controls['blackDate'].setValue(result.blackDate);
      // this.transForm.controls['blackReason'].setValue(result.blackReason);
      // this.transForm.controls['blackRemovedDate'].setValue(result.blackRemovedDate);
      // this.transForm.controls['blackRemovedReason'].setValue(result.blackRemovedReason);
      this.isAdd=false;
      this.breadCrumbItems = [{ label: 'Transporter',rounterLink:'/transporter-detail',active:false }, { label: 'Edit Transporter', active: true }];
      this.spinner.hide();
    });
  }

  saveTransporter() {
    const formData = this.transForm.value;
    if (this.isAdd) {
      formData.createdUser = localStorage.getItem('currentUser');
      this.addNewTransporter(formData);
    } else {
      formData.updatedUser = localStorage.getItem('currentUser');
      this.editTransporter(formData);
    }
  }

  addNewTransporter(data: any) {
    this.spinner.show();
    const formData = new FormData();
    formData.append("TransporterCode",data.transporterCode);
    formData.append("TransporterName",data.transporterName);
    formData.append("Address",data.address);
    formData.append("ContactNo",data.contactNo);
    formData.append("Email",data.email);
    formData.append("ContactPerson",data.contactPerson);
    formData.append("TransporterType",data.transporterType);
    formData.append("Remarks",data.remarks);
    formData.append("Active",data.active.toString());
    this.service.createTransporter(formData)
    .pipe(catchError((err) => of(this.showError(err))))
    .subscribe((result) => {
      this.spinner.hide();
      if (result.status) {
        this.showSuccess('Transporter added successfully!');
        this.router.navigate(["master/transporter"]);
      } else {
        Swal.fire('Transporter', result.messageContent, 'error');
      }
    });
  }
   
  editTransporter(data: any) {
      this.spinner.show();
      const formData = new FormData();
      formData.append("TransporterCode",this.id);
      formData.append("TransporterName",data.transporterName);
      formData.append("Address",data.address);
      formData.append("ContactNo",data.contactNo);
      formData.append("Email",data.email);
      formData.append("ContactPerson",data.contactPerson);
      formData.append("TransporterType",data.transporterType);
      formData.append("Remarks",data.remarks);
      formData.append("Active",data.active.toString());
      // formData.append("IsBlack",data.isBlack.toString());
      this.service.updateTransporter(formData)
        .pipe(catchError((err) => of(this.showError(err))))
        .subscribe((result) => {
          this.spinner.hide();
          if (result.status) {
            this.showSuccess('Transporter updated successfully!');
            this.router.navigate(["master/transporter"]);
          } else {
            Swal.fire('Transporter', result.messageContent, 'error');
          }
        });
    }
  
    showSuccess(msg: string) {
      Swal.fire('Transporter', msg, 'success');
    }
  
    showError(error: HttpErrorResponse) {
      Swal.fire('Transporter', error.statusText, 'error');
    }

    
   

}