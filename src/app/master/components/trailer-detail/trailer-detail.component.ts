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
  containerTypeList: any[] = ["Dry Container","HC Container","Open-Top Container","Tank Container"];
  containerSizeList:any[]=[20,40];
  transporterNames:any[]=[];
  formatfilter:string='dd-MMM-yyyy';
  today : Date = new Date();
  // loadingTypeList:any[]=["Bin","Bulk","Containers","Drums","Pallets","Skids"];

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
      containerType: new FormControl('',Validators.required),
      containerSize:new FormControl('',Validators.required),
      transporterID:new FormControl('',Validators.required),
      trailerWeight:new FormControl(''),
      driverLicenseNo:new FormControl('',Validators.required),
      remarks:new FormControl(''),
      active: new FormControl(false),
      lastPassedDate:new FormControl(null),

      isBlack:new FormControl(false), 
      blackDate:new FormControl(''),
      blackRemovedDate:new FormControl(''),
    });
    if (this.id) {
      this.getTrailerById();
      this.isAdd=true;
    }
    
    this.service.getTransporterNames().subscribe({
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
      this.trailerForm.controls['lastPassedDate'].setValue(result.lastPassedDate);
      
      this.isAdd=false;
      this.breadCrumbItems = [{ label: 'Trailer',rounterLink:'/trailer-detail',active:false }, { label: 'Edit Trailer', active: true }];
      this.spinner.hide();
    });
  }

  saveTrailer() {
    const formData = this.trailerForm.value;
    if (this.isAdd) {
      formData.createdUser = localStorage.getItem('currentUser');
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
    const formData = new FormData();
    formData.append("VehicleRegNo", data.vehicleRegNo);
    formData.append("VehicleBackRegNo", data.vehicleBackRegNo);
    formData.append("ContainerType", data.containerType);
    formData.append("ContainerSize",data.containerSize);
    formData.append("TransporterID", data.transporterID);
    formData.append("TrailerWeight",data.trailerWeight);
    formData.append("DriverLicenseNo",data.driverLicenseNo);
    formData.append("Remarks",data.remarks);
    formData.append("Active",data.active);

    if(data.lastPassedDate){
      const lastPass=data.lastPassedDate instanceof Date? data.lastPassedDate:new Date(data.lastPassedDate);
      const localLastPassedDate=new Date(lastPass.getTime()-lastPass.getTimezoneOffset()*60000)
      .toISOString()
      .split("T")[0];
      formData.append("LastPassedDate",localLastPassedDate);
    }
    
    this.service.createTrailer(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.spinner.hide();
        if (result.status) {
          this.showSuccess('Trailer added successfully!');
          this.router.navigate(["master/trailer"]);
        } else {
          Swal.fire('Trailer', result.messageContent, 'error');
        }
      });
  }

  editTrailer(data: any) {
    this.spinner.show();
    const formData = new FormData();
    formData.append("VehicleRegNo", this.id);
    formData.append("VehicleBackRegNo", data.vehicleBackRegNo);
    formData.append("ContainerType", data.containerType);
    formData.append("ContainerSize",data.containerSize);
    formData.append("TransporterID", data.transporterID);
    formData.append("TrailerWeight",data.trailerWeight);
    formData.append("DriverLicenseNo",data.driverLicenseNo);
    formData.append("Remarks",data.remarks);
    formData.append("Active",data.active);

    if(data.lastPassedDate){
      const lastPass=data.lastPassedDate instanceof Date? data.lastPassedDate:new Date(data.lastPassedDate);
      const localLastPassedDate=new Date(lastPass.getTime()-lastPass.getTimezoneOffset()*60000)
      .toISOString()
      .split("T")[0];
      formData.append("LastPassedDate",localLastPassedDate);
    }
    
    this.service.updateTrailer(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.spinner.hide();
        if (result.status) {
          this.showSuccess('Trailer updated successfully!');
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

}
