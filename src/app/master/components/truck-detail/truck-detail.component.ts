import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, forkJoin, last, of } from 'rxjs';
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
  breadCrumbItems: Array<{}>;
  isAdd: boolean = true;
  truckTypeList: any[] = []; // Array to store truck types
  driverLicenseNoList:any[];
  transporterNames:any[]=[];
  containerSizeList: any[] = [20, 40, 45];
  containerTypeList: any[] = ["DV","FR","GP", "HC", "HQ","HG","OS","OT","PF","RF","RH","TK", "IC", "FL", "BC", "HT", "VC", "PL"];
  formatfilter:string='dd-MMM-yyyy';
  today : Date = new Date();


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
      containerType: new FormControl(''),
      containerSize:new FormControl(''),
      truckWeight:new FormControl(''),
      typeID: new FormControl('', Validators.required),
      transporterID:new FormControl('',Validators.required),
      active: new FormControl(false),
      driverLicenseNo:new FormControl(''),
      lastPassedDate:new FormControl(null),
      vehicleBackRegNo:new FormControl(''),
      remarks:new FormControl(''),

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
    
    if(this.id!=null && this.id!=undefined){
      this.getTruckById();
      // this.isAdd=false;
    }
    this.service.getTruckTypes('true').subscribe({
      next: (types) => {
        this.truckTypeList = types;
      },
      error: (error) => {
        console.error('Error loading truck types', error);
      }
    });
    
    this.service.getDriverLicenseNo('true').subscribe({
      next:(LicenseNoList)=>{
        console.log("Driver License and Names Loaded:",LicenseNoList);
        this.driverLicenseNoList=LicenseNoList;
      },
      error:(error)=>{
        console.log('Error Loading Transporter Names',error)
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
   .pipe(catchError((err) => of(this.showError(err))))
     .subscribe((result) => {
      this.truckForm.controls['vehicleRegNo'].setValue(result.vehicleRegNo);
      this.truckForm.controls['containerType'].setValue(result.containerType);
      this.truckForm.controls['containerSize'].setValue(result.containerSize);
      this.truckForm.controls['truckWeight'].setValue(result.truckWeight);
      this.truckForm.controls['typeID'].setValue(result.typeID);
      this.truckForm.controls['transporterID'].setValue(result.transporterID);
      this.truckForm.controls['active'].setValue(result.active);
      this.truckForm.controls['driverLicenseNo'].setValue(result.driverLicenseNo);
      this.truckForm.controls['lastPassedDate'].setValue(result.lastPassedDate);
      this.truckForm.controls['vehicleBackRegNo'].setValue(result.vehicleBackRegNo);
      this.truckForm.controls['remarks'].setValue(result.remarks);
      // this.truckForm.controls['isBlack'].setValue(result.isBlack);
      // this.truckForm.controls['blackDate'].setValue(result.blackDate);
      // this.truckForm.controls['blackReason'].setValue(result.blackReason);
      // this.truckForm.controls['blackRemovedDate'].setValue(result.blackRemovedDate);
      // this.truckForm.controls['blackRemovedReason'].setValue(result.blackRemovedReason);
      this.isAdd=false;
      this.breadCrumbItems = [{ label: 'Truck',rounterLink:'/truck-detail',active:false }, { label: 'Edit Truck', active: true }];
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
    formData.append("ContainerType", data.containerType);
    formData.append("ContainerSize",data.containerSize);
    formData.append("TruckWeight", data.truckWeight);
    formData.append("TypeID",data.typeID);
    formData.append("TransporterID",data.transporterID);
    formData.append("Active",data.active);
    formData.append("DriverLicenseNo",data.driverLicenseNo);
    formData.append("VehicleBackRegNo",data.vehicleBackRegNo);
    formData.append("Remarks",data.remarks);
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
        if (result.status==true) {
          this.spinner.hide();
          this.showSuccess('Truck added successfully!');
          this.router.navigate(["master/truck"]);
        } else {
          this.spinner.hide();
          Swal.fire('Truck', result.messageContent, 'error');
        }
      });
  }

  editTruck(data: any) {
    this.spinner.show();
    const formData = new FormData();
    data.active=data.active?true:false;
    formData.append("VehicleRegNo",this.id);
    formData.append("ContainerType", data.containerType);
    formData.append("ContainerSize",data.containerSize);
    formData.append("TruckWeight", data.truckWeight);
    formData.append("TypeID",data.typeID);
    formData.append("TransporterID",data.transporterID);
    formData.append("Active",data.active);
    formData.append("DriverLicenseNo",data.driverLicenseNo);
    formData.append("VehicleBackRegNo",data.vehicleBackRegNo);
    formData.append("Remarks",data.remarks);
    
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
