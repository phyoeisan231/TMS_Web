import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TrailerDetailService } from './trailer-detail.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, last, of } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { MasterModule } from '../../master.module';
import { error } from 'console';
import { NavBarComponent } from "../../../theme/layouts/admin-layout/nav-bar/nav-bar.component";
import moment from 'moment';

@Component({
  selector: 'app-trailer-detail',
  standalone: true,
  imports: [MasterModule],
  templateUrl: './trailer-detail.component.html',
  styleUrl: './trailer-detail.component.scss'
})
export class TrailerDetailComponent implements OnInit{
  trailerForm: FormGroup;
  id: string;
  breadCrumbItems: Array<{}>;
  isAdd: boolean = true;
  containerSizeList: any[] = [20, 40, 45];
  containerTypeList: any[] = ["DV","FR","GP", "HC", "HQ","HG","OS","OT","PF","RF","RH","TK", "IC", "FL", "BC", "HT", "VC", "PL"];
  transporterNames:any[]=[];
  driverLicenseNoList:any[];
  formatfilter:string='dd-MMM-yyyy';
  today : Date = new Date();
  submitClicked: boolean = false;

  constructor(
    private _sanitizer: DomSanitizer,
    private service: TrailerDetailService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Trailer List', routerLink: '/trailer-detail', active: false },
    { label: 'Add New Trailer', active: true }];
    this.id = this.route.snapshot.queryParams['id'];
    this.trailerForm = new FormGroup({
      vehicleRegNo: new FormControl({value:this.id,disabled:!!this.id },Validators.required),
      vehicleBackRegNo: new FormControl(''),
      containerType: new FormControl(''),
      containerSize:new FormControl(''),
      transporterID:new FormControl('',Validators.required),
      trailerWeight:new FormControl(''),
      driverLicenseNo:new FormControl(''),
      remarks:new FormControl(''),
      active: new FormControl(false),
      // lastPassedDate:new FormControl(null),
      isBlack:new FormControl(''),
      
    });
    if (this.id) {
      this.getTrailerById();
      this.isAdd=true;
    }

    this.service.getDriverList('true', 'false').subscribe({
      next: (LicenseNoList:any[]) => { 
        console.log("Driver License and Names Loaded:", LicenseNoList);
        this.driverLicenseNoList = LicenseNoList; 
      },
      error: (error: any) => {
        console.error('Error Loading Transporter Names:', error); 
      }
    });
    
    this.service.getTransporterList('true','false').subscribe({
      next:(names)=>{
        console.log("Transporter Names Loaded:",names);
        this.transporterNames=names;
      },
      error:(error)=>{
        console.log('Error Loading Transporter Names',error)
      }
    });
  }

  getTrailerById() {
    this.spinner.show();
    this.service.getTrailerId(this.id)
   .pipe(catchError((err) => of(this.showError(err))))
     .subscribe((result) => {
      this.trailerForm.controls['vehicleRegNo'].setValue(result.vehicleRegNo);
      this.trailerForm.controls['vehicleBackRegNo'].setValue(result.vehicleBackRegNo);
      this.trailerForm.controls['containerType'].setValue(result.containerType);
      this.trailerForm.controls['containerSize'].setValue(result.containerSize);
      this.trailerForm.controls['transporterID'].setValue(result.transporterID);
      this.trailerForm.controls['trailerWeight'].setValue(result.trailerWeight);
      this.trailerForm.controls['driverLicenseNo'].setValue(result.driverLicenseNo);
      this.trailerForm.controls['remarks'].setValue(result.remarks);
      this.trailerForm.controls['active'].setValue(result.active);
      this.trailerForm.controls['isBlack'].setValue(result.isBlack);
      // this.trailerForm.controls['lastPassedDate'].setValue(result.lastPassedDate);

      this.isAdd=false;
      this.breadCrumbItems = [{ label: 'Trailer',rounterLink:'/trailer-detail',active:false }, { label: 'Edit Trailer', active: true }];
      this.spinner.hide();
    });
  }

  saveTrailer() {
    const formData = this.trailerForm.value;
    if (this.isAdd) {
      formData.createdUser = localStorage.getItem('currentUser');
      formData.vehicleRegNo=formData.vehicleRegNo.toUpperCase();
      formData.vehicleBackRegNo=formData.vehicleBackRegNo.toUpperCase();
      formData.isBlack=formData.isBlack;
      this.addNewTrailer(formData);
    } else {
      formData.updatedUser = localStorage.getItem('currentUser');
      this.editTrailer(formData);
    }
  }
  navigateToTrailer() {
    this.router.navigate(['master/trailer']);
  }

  addNewTrailer(data: any) {
    this.spinner.show();
    const formData = {
      VehicleRegNo: data.vehicleRegNo,
      VehicleBackRegNo: data.vehicleBackRegNo,
      ContainerType: data.containerType,
      ContainerSize: data.containerSize ?? '',
      TransporterID: data.transporterID,
      TrailerWeight: data.trailerWeight ?? '',
      DriverLicenseNo: data.driverLicenseNo,
      Remarks: data.remarks,
      Active: data.active,
      IsBlack: data.isBlack,
      // LastPassedDate: moment(data.lastPassedDate).format('YYYY/MM/DD'),
    }
    this.service.createTrailer(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.spinner.hide();
        if (result.status) {
          this.showSuccess('Trailer Added Successfully!');
          this.router.navigate(["master/trailer"]);
        } else {
          Swal.fire('Trailer', result.messageContent, 'error');
        }
      });
  }

  editTrailer(data: any) {
    this.spinner.show();
    const formData = {
      VehicleRegNo: this.id,
      VehicleBackRegNo: data.vehicleBackRegNo ?? "",
      ContainerType: data.containerType,
      ContainerSize: data.containerSize ?? "",
      TransporterID: data.transporterID,
      TrailerWeight: data.trailerWeight ?? "",
      DriverLicenseNo: data.driverLicenseNo,
      Remarks: data.remarks ?? "",
      Active: data.active,
      IsBlack: data.isBlack,
      // LastPassedDate: moment(data.lastPassedDate).format('YYYY/MM/DD'),
    };
    this.service.updateTrailer(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.spinner.hide();
        if (result.status) {
          this.showSuccess('Trailer Updated Successfully!');
          this.router.navigate(["master/trailer"]);
        } else {
          Swal.fire('Trailer', result.messageContent, 'error');
        }
      });
}

  showSuccess(msg: string) {
    Swal.fire('Trailer', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    Swal.fire('Trailer', error.statusText, 'error');
  }

  validateControl(controlName: string) {
    const control = this.trailerForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }

}
