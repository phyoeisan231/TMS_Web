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
import { DriverDetailService } from './driver-detail.service';
@Component({
  selector: 'app-driver-detail',
  standalone: true,
  imports: [MasterModule],
  templateUrl: './driver-detail.component.html',
  styleUrl: './driver-detail.component.scss'
})
export class DriverDetailComponent implements OnInit{
  driverForm: FormGroup;
  id: string;
  breadCrumbItems: Array<{}>;
  // breadCrumbItems: Array<{ label: string, routerLink?: string, active?: boolean }>;
  isAdd: boolean = true;
  transporterNames:any[]=[];
  formatfilter:string='dd-MMM-yyyy';
  today : Date = new Date();


  constructor(
    private _sanitizer: DomSanitizer,
    private service: DriverDetailService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}
 
  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Driver List', routerLink: '/driver-detail', active: false },
    { label: 'Add New Driver', active: true }];
    this.id = this.route.snapshot.queryParams['id'];
    this.driverForm = new FormGroup({
      licenseNo: new FormControl({value:this.id,disabled:!!this.id },Validators.required),
      nrc: new FormControl('',Validators.required),
      name: new FormControl('',Validators.required),
      address: new FormControl('',Validators.required),
      licenseClass:new FormControl('',Validators.required),
      contactNo: new FormControl('',Validators.required),
      licenseExpiration:new FormControl(null,Validators.required),
      // email: new FormControl('', Validators.compose([Validators.required,
      // Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
      email: new FormControl('',[Validators.email,Validators.required]),
      remarks:new FormControl(''),
      active: new FormControl(false),
    });
    if (this.id) {
      this.getDriverById();
      this.isAdd=false;
    }
    // this.service.getTransporterNames().subscribe({
    //   next:(names)=>{
    //     console.log("Transporter Names Loaded:",names);
    //     this.transporterNames=names;
    //   },
    //   error:(error)=>{
    //     console.log('Error Loading Transporter Names',error)
    //   }
    // });
  }

  navigateToDriver() {
    this.router.navigate(['master/driver']);
  }

  getDriverById() {
    this.spinner.show();
    this.service.getDriverId(this.id)
   .pipe(catchError((err) => of(this.showError(err))))
     .subscribe((result) => {
      this.driverForm.controls['licenseNo'].setValue(result.licenseNo);
      this.driverForm.controls['nrc'].setValue(result.nrc);
      this.driverForm.controls['name'].setValue(result.name);
      this.driverForm.controls['address'].setValue(result.address);
      this.driverForm.controls['licenseClass'].setValue(result.licenseClass);
      this.driverForm.controls['licenseExpiration'].setValue(result.licenseExpiration);
      this.driverForm.controls['contactNo'].setValue(result.contactNo);
      this.driverForm.controls['email'].setValue(result.email);
      this.driverForm.controls['remarks'].setValue(result.remarks);
      this.driverForm.controls['active'].setValue(result.active);
      this.isAdd=false;
      this.breadCrumbItems = [{ label: 'Driver List',rounterLink:'/driver-detail',active:false }, { label: 'Edit Driver', active: true }];
      this.spinner.hide();
    });
  }

  // getDriverById() {
  //   this.spinner.show();
  //   this.service.getDriverId(this.id)
  //       .pipe(catchError((err) => {
  //           this.showError(err); 
  //           return of(null); 
  //       }))
  //       .subscribe((result) => {
  //           if (result) {
  //               this.driverForm.patchValue({
  //                 licenseNo: result.licenseNo,
  //                 nrc: result.nrc,
  //                 name: result.name ?? "",
  //                 address: result.address ?? "",
  //                 licenseClass: result.licenseClass ?? "",
  //                 contactNo: result.contactNo ?? 0,
  //                 email: result.email,
  //                 transporter: result.transporter,
  //                 remarks: result.remarks ?? "",
  //                 active: result.active ?? false,
  //               });
                
  //               this.breadCrumbItems = [
  //                   { label: 'Driver List', routerLink: '/driver', active: false },
  //                   { label: 'Edit Driver', active: true }
  //               ];
  //               this.isAdd = false; // Set to false since we are editing
  //           } 
  //           this.spinner.hide();
  //       });
  // }

  
  saveDriverList() {
    const formData = this.driverForm.value;
    if (this.isAdd) {
      formData.createdUser = localStorage.getItem('currentUser');
      this.addNewDriver(formData);
    } else {
      formData.updatedUser = localStorage.getItem('currentUser');
      this.editDriver(formData);
    }
  }

  addNewDriver(data: any) {
    this.spinner.show();
    const formData = new FormData();
    formData.append("LicenseNo",data.licenseNo);
    formData.append("NRC",data.nrc);
    formData.append("Name",data.name);
    formData.append("Address",data.address);
    formData.append("LicenseClass",data.licenseClass);
    formData.append("ContactNo",data.contactNo);
    formData.append("Email",data.email);
    formData.append("Remarks",data.remarks);
    formData.append("Active",data.active);

    if(data.licenseExpiration){
      const lastExp=data.licenseExpiration instanceof Date? data.licenseExpiration:new Date(data.licenseExpiration);
      const localLastDate=new Date(lastExp.getTime()-lastExp.getTimezoneOffset()*60000)
      .toISOString()
      .split("T")[0];
      formData.append("LicenseExpiration",localLastDate);
    }

    this.service.createDriver(formData)
    .pipe(catchError((err) => of(this.showError(err))))
    .subscribe((result) => {
      this.spinner.hide();
      if (result.status) {
        this.showSuccess('Driver added successfully!');
        this.router.navigate(["master/driver"]);
      } else {
        Swal.fire('driver', result.messageContent, 'error');
      }
    });
  }
   
  editDriver(data: any) {
      this.spinner.show();
      const formData = new FormData();
      data.active=data.active?true:false;
      formData.append("LicenseNo",this.id);
      formData.append("NRC",data.nrc);
      formData.append("Name",data.name);
      formData.append("Address",data.address);
      formData.append("licenseClass",data.licenseClass);
      formData.append("ContactNo",data.contactNo);
      formData.append("Email",data.email);
      formData.append("Remarks",data.remarks);
      formData.append("Active", data.active); 

      if(data.licenseExpiration){
        const lastExp=data.licenseExpiration instanceof Date? data.licenseExpiration:new Date(data.licenseExpiration);
        const localLastDate=new Date(lastExp.getTime()-lastExp.getTimezoneOffset()*60000)
        .toISOString()
        .split("T")[0];
        formData.append("LicenseExpiration",localLastDate);
      }      
      this.service.updateDriver(formData)
        .pipe(catchError((err) => of(this.showError(err))))
        .subscribe((result) => {
          this.spinner.hide();
          if (result.status) {
            this.showSuccess('Driver updated successfully!');
            this.router.navigate(["master/driver"]);
          } else {
            Swal.fire('Driver', result.messageContent, 'error');
          }
        });
    }
  
    showSuccess(msg: string) {
      Swal.fire('Driver', msg, 'success');
    }
  
    showError(error: HttpErrorResponse) {
      Swal.fire('Driver', error.statusText, 'error');
    }


}
