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
  breadCrumbItems: Array<{ label: string, routerLink?: string, active?: boolean }>;
  isAdd: boolean = true;
  trailerTypeList: any[] = []; // Array to store truck-trailer types
  transporterNames:any[]=[];
  formatfilter:string='dd-MMM-yyyy';
  today : Date = new Date();
  loadingTypeList:any[]=["Bin","Bulk","Containers","Drums","Pallets","Skids"];

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
      unladenWeight: new FormControl(''),
      flowrate: new FormControl(''),
      trailerType: new FormControl('',Validators.required),
      transporter:new FormControl(''),
      compartmentNo: new FormControl(''),
      vehicleBackRegNo:new FormControl(''),
      loadingType:new FormControl(''),
      blackDate:new FormControl(''),
      driverLicenseNo:new FormControl(''),
      remarks:new FormControl(''),
      active: new FormControl(false),
      isBlack:new FormControl(false), 
      lastLoadingDate:new FormControl(null),
      blackRemovedDate:new FormControl(''),
    });
    if (this.id) {
      this.getTrailerById();
      this.isAdd=true;
    }
    this.service.getTrailerTypes().subscribe({
      next: (types) => {
        console.log("Trailer Types Loaded:", types); // Check if data is coming through
        this.trailerTypeList = types;
      },
      error: (error) => {
        console.error('Error loading trailer types', error);
      }
    });
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
        if (result) {
          this.trailerForm.patchValue({
            vehicleRegNo: result.vehicleRegNo,
            unladenWeight: result?.unladenWeight??0,
            flowrate: result?.flowrate??0,
            trailerType: result.trailerType,
            transporter: result?.transporter??"",
            compartmentNo: result?.compartmentNo??0,
            remarks:result?.remarks??"",
            vehicleBackRegNo:result?.vehicleBackRegNo??"",
            loadingType:result?.loadingType??"",
            blackDate: result.blackDate ? new Date(result.blackDate) : null,
            driverLicenseNo:result?.driverLicenseNo??"",
            active: result.active ?? false,
            isBlack: result.isBlack ?? false,
            lastLoadingDate:result.lastLoadingDate?new Date(result.lastLoadingDate):null,
            blackRemovedDate:result.blackRemovedDate?new Date(result.blackRemovedDate):null,
          });
          this.breadCrumbItems = [
            { label: 'Trailer List', routerLink: '/trailer', active: false },
            { label: 'Edit trailer', active: true }
          ];
          this.isAdd = false; // Set to false since we are editing
        }
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
    formData.append("UnladenWeight", data.unladenWeight);
    formData.append("Flowrate", data.flowrate);
    formData.append("TrailerType", data.trailerType);
    formData.append("Transporter",data.transporter);
    formData.append("CompartmentNo", data.compartmentNo);
    formData.append("Remarks", data.remarks);
    formData.append("LoadingType",data.loadingType);
    formData.append("VehicleBackRegNo",data.vehicleBackRegNo);
    formData.append("DriverLicenseNo",data.driverLicenseNo);
    formData.append("IsBlack",data.isBlack.toString());
    formData.append("Active",data.active.toString());

    if (data.blackDate) {
      const blackDate = data.blackDate instanceof Date ? data.blackDate : new Date(data.blackDate);
      const localDate = new Date(blackDate.getTime() - blackDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];
      formData.append("BlackDate", localDate);
    }
    if(data.lastLoadingDate){
      const lastLoading=data.lastLoadingDate instanceof Date? data.lastLoadingDate:new Date(data.lastLoadingDate);
      const localLastLoadingDate=new Date(lastLoading.getTime()-lastLoading.getTimezoneOffset()*60000)
      .toISOString()
      .split("T")[0];
      formData.append("LastLoadingDate",localLastLoadingDate);
    }
    if(data.blackRemovedDate){
      const blackRemoved=data.blackRemovedDate instanceof Date? data.blackRemovedDate:new Date(data.blackRemovedDate);
      const localBlackRemoved=new Date(blackRemoved.getTime()-blackRemoved.getTimezoneOffset()*60000)
      .toISOString()
      .split("T")[0];
      formData.append("BlackRemovedDate",localBlackRemoved);
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
    formData.append("UnladenWeight", data.unladenWeight);
    formData.append("Flowrate", data.flowrate);
    formData.append("TrailerType", data.trailerType);
    formData.append("Transporter",data.transporter);
    formData.append("CompartmentNo", data.compartmentNo);
    formData.append("Remarks", data.remarks);
    formData.append("LoadingType",data.loadingType);
    formData.append("VehicleBackRegNo",data.vehicleBackRegNo);
    formData.append("DriverLicenseNo",data.driverLicenseNo);
    formData.append("IsBlack",data.isBlack.toString());
    formData.append("Active", data.active.toString());  // Ensure it's a string if your API requires it

    if (data.blackDate) {
      const blackDate = data.blackDate instanceof Date ? data.blackDate : new Date(data.blackDate);
      const localDate = new Date(blackDate.getTime() - blackDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0]; 
      formData.append("BlackDate", localDate);
    }
    if(data.lastLoadingDate){
      const lastLoading=data.lastLoadingDate instanceof Date? data.lastLoadingDate:new Date(data.lastLoadingDate);
      const localLastLoadingDate=new Date(lastLoading.getTime()-lastLoading.getTimezoneOffset()*60000)
      .toISOString()
      .split("T")[0];
      formData.append("LastLoadingDate",localLastLoadingDate);
    }
    if(data.blackRemovedDate){
      const blackRemoved=data.blackRemovedDate instanceof Date? data.blackRemovedDate:new Date(data.blackRemovedDate);
      const localBlackRemoved=new Date(blackRemoved.getTime()-blackRemoved.getTimezoneOffset()*60000)
      .toISOString()
      .split("T")[0];
      formData.append("BlackRemovedDate",localBlackRemoved);
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
