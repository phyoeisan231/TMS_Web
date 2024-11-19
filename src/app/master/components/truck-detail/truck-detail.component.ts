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
import { TruckDetailService } from './truck-detail.service';
@Component({
  selector: 'app-truck-detail',
  standalone: true,
  imports: [MasterModule],
  templateUrl: './truck-detail.component.html',
  styleUrl: './truck-detail.component.scss'
})
export class TruckDetailComponent {
  truckForm: FormGroup;
  id: string;
  breadCrumbItems: Array<{ label: string, routerLink?: string, active?: boolean }>;
  isAdd: boolean = true;
  truckTypeList: any[] = []; // Array to store truck types
  transporterNames:any[]=[];
  formatfilter:string='dd-MMM-yyyy';
  today : Date = new Date();
  loadingTypeList:any[]=["Bin","Bulk","Containers","Drums","Pallets","Skids"];


  constructor(
    private _sanitizer: DomSanitizer,
    private service: TruckDetailService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Truck List', routerLink: '/truck-detail', active: false },
    { label: 'Add New Truck', active: true }];
    this.id = this.route.snapshot.queryParams['id'];
   
    this.truckForm = new FormGroup({
      vehicleRegNo: new FormControl({value:this.id,disabled:!!this.id },Validators.required),
      transporter: new FormControl(''),
      remarks:new FormControl(''),
      truckType: new FormControl('', Validators.required),
      truckWeight:new FormControl(''),
      vehicleBackRegNo:new FormControl(''),
      driverLicenseNo:new FormControl(''),
      active: new FormControl(false),
      lastPassedDate:new FormControl(null),

      // isBlack:new FormControl(false),
      // blackReason:new FormControl(''),
      // blackDate:new FormControl(null),
      // blackRemovedDate: new FormControl(null),
      // blackRemovedReason:new FormControl(''),
      //truckWeight:new FormControl(''),
      //containerType:new FormControl(''),
      //containerSize:new FormControl(''),
      //name:new FormControl(''),
    });
    if (this.id) {
      this.getTruckById();
      this.isAdd=false;
    }
    this.service.getTruckTypes().subscribe({
      next: (types) => {
        this.truckTypeList = types;
      },
      error: (error) => {
        console.error('Error loading truck types', error);
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


  getTruckById() {
    this.spinner.show();
    this.service.getTruckId(this.id)
        .pipe(catchError((err) => {
            this.showError(err); 
            return of(null); 
        }))
        .subscribe((result) => {
            if (result) {
                this.truckForm.patchValue({
                    vehicleRegNo: result.vehicleRegNo,
                    transporter: result.transporter ?? "",
                    remarks: result.remarks ?? "",
                    truckType: result.truckType,
                    truckWeight: result.truckWeight ?? 0,
                    vehicleBackRegNo: result.vehicleBackRegNo ?? "",
                    driverLicenseNo:result.driverLicenseNo??"",
                    active: result.active ?? false,
                    lastPassedDate:result.lastPassedDate?new Date(result.lastPassedDate):null,

                    //name:result.name??"",
                    //containerType:result.containerType??"",
                    //containerSize:result.containerSize??0,
                    // isBlack: result.isBlack ?? false,
                    // blackDate: result.blackDate ? new Date(result.blackDate) : null,
                    // blackReason: result.blackReason ?? "",
                    // blackRemovedDate:result.blackRemovedDate?new Date(result.blackRemovedDate):null,
                    // blackRemovedReason:result.blackRemovedReason??"",
                });
                
                this.breadCrumbItems = [
                    { label: 'Truck List', routerLink: 'master/truck', active: false },
                    { label: 'Edit Truck', active: true }
                ];
                this.isAdd = false; // Set to false since we are editing
            } 
            this.spinner.hide();
        });
  }

  saveTruck() {
    const formData = this.truckForm.value;
    if (this.isAdd) {
      formData.createdUser = localStorage.getItem('currentUser');
      this.addNewTruck(formData);
    } else {
      formData.updatedUser = localStorage.getItem('currentUser');
      this.editTruck(formData);
    }
  }
  navigateToTruck() {
    this.router.navigate(['master/truck']);
  }

  addNewTruck(data: any) {
    this.spinner.show();
    const formData = new FormData();
    formData.append("VehicleRegNo", data.vehicleRegNo);
    formData.append("Transporter", data.transporter);
    formData.append("Remarks",data.remarks);
    formData.append("TruckType", data.truckType);
    formData.append("TruckWeight",data.truckWeight);
    formData.append("VehicleBackRegNo",data.vehicleBackRegNo);
    formData.append("DriverLicenseNo",data.driverLicenseNo);
    formData.append("Active", data.active.toString());  // Ensure it's a string if your API requires it
    // formData.append("IsBlack",data.isBlack.toString());
    // formData.append("BlackReason",data.blackReason);
    // formData.append("BlackRemovedReason",data.blackRemovedReason);
    //formData.append("Name",data.name);
    //formData.append("ContainerType",data.containerType);
    //formData.append("ContainerSize",data.containerSize);

    // if (data.blackDate) {
    //   const blackedDate = data.blackDate instanceof Date ? data.blackDate : new Date(data.blackDate);
    //   const localDate = new Date(blackedDate.getTime() - blackedDate.getTimezoneOffset() * 60000)
    //     .toISOString()
    //     .split("T")[0]; // Get only the date portion in 'yyyy-MM-dd' format
    //   formData.append("BlackDate", localDate);
    // }
    // if(data.blackRemovedDate){
    //   const blackRemoved=data.blackRemovedDate instanceof Date?data.blackRemovedDate:new Date(data.blackRemovedDate);
    //   const localRemovedDate=new Date(blackRemoved.getTime()-blackRemoved.getTimezoneOffset()*60000)
    //   .toISOString()
    //   .split("T")[0];
    //   formData.append("BlackRemovedDate",localRemovedDate);
    // }
    if(data.lastPassedDate){
      const lastPass=data.lastPassedDate instanceof Date? data.lastPassedDate:new Date(data.lastPassedDate);
      const localLastPassedDate=new Date(lastPass.getTime()-lastPass.getTimezoneOffset()*60000)
      .toISOString()
      .split("T")[0];
      formData.append("LastPassedDate",localLastPassedDate);
    }

    this.service.createTruck(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.spinner.hide();
        if (result.status) {
          this.showSuccess('Truck added successfully!');
          this.router.navigate(["master/truck"]);
        } else {
          Swal.fire('Truck', result.messageContent, 'error');
        }
      });
  }

  editTruck(data: any) {
    this.spinner.show();
    const formData = new FormData();
    formData.append("VehicleRegNo", this.id);
    formData.append("Transporter", data.transporter);
    formData.append("Remarks",data.remarks);
    formData.append("TruckType", data.truckType);
    formData.append("TruckWeight",data.truckWeight);
    formData.append("VehicleBackRegNo",data.vehicleBackRegNo);
    formData.append("DriverLicenseNo",data.driverLicenseNo);
    formData.append("Active", data.active.toString());  // Ensure it's a string if your API requires it
    // formData.append("IsBlack",data.isBlack.toString());
    // formData.append("BlackReason",data.blackReason);
    // formData.append("BlackRemovedReason",data.blackRemovedReason);
    //formData.append("Name",data.name);
    //formData.append("ContainerType",data.containerType);
    //formData.append("ContainerSize",data.containerSize);

    // if(data.blackDate){
    //   const blackedDate=data.blackDate instanceof Date? data.blackDate:new Date(data.blackDate);
    //   const localDate=new Date(blackedDate.getTime()-blackedDate.getTimezoneOffset()*60000)
    //   .toISOString()
    //   .split("T")[0];
    //   formData.append("BlackDate",localDate);
    // }
    // if(data.blackRemovedDate){
    //   const blackRemoved=data.blackRemovedDate instanceof Date ? data.blackRemovedDate:new Date(data.blackRemovedDate);
    //   const localRemovedDate=new Date(blackRemoved.getTime()-blackRemoved.getTimezoneOffset()*60000)
    //   .toISOString()
    //   .split("T")[0];
    //   formData.append("BlackRemovedDate",localRemovedDate);
    // }
    if(data.lastPassedDate){
      const lastPass=data.lastPassedDate instanceof Date? data.lastPassedDate:new Date(data.lastPassedDate);
      const localLastPassedDate=new Date(lastPass.getTime()-lastPass.getTimezoneOffset()*60000)
      .toISOString()
      .split("T")[0];
      formData.append("LastPassedDate",localLastPassedDate);
    }
    
    this.service.updateTruck(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.spinner.hide();
        if (result.status) {
          this.showSuccess('Truck updated successfully!');
          this.router.navigate(["master/truck"]);
        } else {
          Swal.fire('Truck', result.messageContent, 'error');
        }
      });
  }

  showSuccess(msg: string) {
    Swal.fire('Truck', msg, 'success');
  }

  showError(error: HttpErrorResponse) {
    Swal.fire('Truck', error.statusText, 'error');
  }

}
