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
import moment from 'moment';
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
  isAdd: boolean = true;
  transporterNames:any[]=[];
  classList: string[]=['A','B','C','D','E'];
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
      nrc: new FormControl(''),
      name: new FormControl('',Validators.required),
      address: new FormControl(''),
      licenseClass:new FormControl('',Validators.required),
      contactNo: new FormControl(''),
      licenseExpiration:new FormControl(null,Validators.required),
      // email: new FormControl('', Validators.compose([Validators.required,
      // Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
      email: new FormControl('',[Validators.email]),
      remarks:new FormControl(''),
      active: new FormControl(false),
      isBlack:new FormControl(''),
    });
    if (this.id) {
      this.getDriverById();
    }
    
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
      this.driverForm.controls['isBlack'].setValue(result.isBlack);

      this.isAdd=false;
      this.breadCrumbItems = [{ label: 'Driver List',rounterLink:'/driver-detail',active:false }, { label: 'Edit Driver', active: true }];
      this.spinner.hide();
    });
  }

  saveDriverList() {
    const formData = this.driverForm.value;
    if (this.isAdd) {
      formData.createdUser = localStorage.getItem('currentUser');
      this.driverForm=formData.isBlack
      this.addNewDriver(formData);
    } else {
      formData.updatedUser = localStorage.getItem('currentUser');
      this.editDriver(formData);
    }
  }

  addNewDriver(data: any) {
    this.spinner.show();
    const formData = {
      LicenseNo: data.licenseNo,
      NRC: data.nrc,
      Name: data.name,
      Address: data.address,
      LicenseClass: data.licenseClass,
      ContactNo: data.contactNo,
      Email: data.email,
      Remarks: data.remarks,
      Active: data.active,
      IsBlack:data.isBlack,
      LicenseExpiration: moment(data.licenseExpiration).format('YYYY/MM/DD'),
    };
    this.service.createDriver(formData)
      .pipe(catchError((err) => of(this.showError(err)))) // Catch errors and show them
      .subscribe((result) => {
        this.spinner.hide();
        if (result.status) {
          this.showSuccess('Driver Added Successfully!');
          this.router.navigate(["master/driver"]);
        } else {
          Swal.fire('Driver', result.messageContent, 'error');
          this.router.navigate(["master/driver"]);
        }
      });
  }
   
  editDriver(data: any) {
    this.spinner.show();
    const formData = {
      LicenseNo: this.id,
      NRC: data.nrc,
      Name: data.name,
      Address: data.address ?? "",  
      LicenseClass: data.licenseClass,
      ContactNo: data.contactNo,
      Email: data.email ?? "",
      Remarks: data.remarks ?? "", 
      Active: data.active ? true : false,
      IsBlack:data.isBlack,
      LicenseExpiration: moment(data.licenseExpiration).format('YYYY/MM/DD'),
    };
    this.service.updateDriver(formData)
      .pipe(catchError((err) => of(this.showError(err)))) // Catch errors and show them
      .subscribe((result) => {
        this.spinner.hide();
        if (result.status) {
          this.showSuccess('Driver Updated Successfully!');
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
