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
import moment from 'moment';
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
      truckWeight: new FormControl(''),
      typeID: new FormControl('', Validators.required),
      transporterID:new FormControl('',Validators.required),
      active: new FormControl(false),
      // isRGL:new FormControl(false),
      isBlack:new FormControl(''),
      driverLicenseNo:new FormControl(''),
      // lastPassedDate:new FormControl(null),
      vehicleBackRegNo:new FormControl(''),
      remarks:new FormControl(''),
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
    
    this.service.getDriverList('true','false').subscribe({
      next:(LicenseNoList:any[])=>{
        console.log("Driver License and Names Loaded:",LicenseNoList);
        this.driverLicenseNoList=LicenseNoList;
      },
      error:(error)=>{
        console.log('Error Loading Transporter Names',error)
      }
    });
    this.service.getTransporterList('true','false').subscribe({
      next:(names:any[])=>{
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
      // this.truckForm.controls['isRGL'].setValue(result.isRGL);
      this.truckForm.controls['isBlack'].setValue(result.isBlack);
      this.truckForm.controls['driverLicenseNo'].setValue(result.driverLicenseNo);
      // this.truckForm.controls['lastPassedDate'].setValue(result.lastPassedDate);
      this.truckForm.controls['vehicleBackRegNo'].setValue(result.vehicleBackRegNo);
      this.truckForm.controls['remarks'].setValue(result.remarks);
      
      this.isAdd=false;
      this.breadCrumbItems = [{ label: 'Truck',rounterLink:'/truck-detail',active:false }, { label: 'Edit Truck', active: true }];
      this.spinner.hide();
    });
  }

  saveTruck() {
    const formData = this.truckForm.value;
    if (this.isAdd) {
      formData.createdUser = localStorage.getItem('currentUser');
      formData.vehicleRegNo=formData.vehicleRegNo.toUpperCase();
      formData.vehicleBackRegNo=formData.vehicleBackRegNo.toUpperCase();
      formData.isBlack=formData.isBlack;
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
    const formData = {
      VehicleRegNo: data.vehicleRegNo,
      ContainerType: data.containerType,
      ContainerSize: data.containerSize,
      TruckWeight: data.truckWeight,
      TypeID: data.typeID,
      TransporterID: data.transporterID,
      Active: data.active,
      // IsRGL: data.isRGL,
      DriverLicenseNo: data.driverLicenseNo,
      VehicleBackRegNo: data.vehicleBackRegNo ?? "",
      Remarks: data.remarks ?? "",
      IsBlack: data.isBlack,
      // LastPassedDate: moment(data.lastPassedDate).format('YYYY/MM/DD'),
    };
    this.service.createTruck(formData)
      .pipe(
        catchError((err) => {
          this.spinner.hide();
          this.showError(err);
          return of({ status: false, messageContent: 'An error occurred while adding the truck.' });
        })
      )
      .subscribe((result) => {
        this.spinner.hide();
        if (result.status) {
          this.showSuccess('Truck Added Successfully!');
          this.router.navigate(["master/truck"]);
        } else {
          Swal.fire('Truck', result.messageContent, 'error');
        }
      });
  }

  editTruck(data: any) {
    this.spinner.show();
    const formData = {
        VehicleRegNo: this.id,
        ContainerType: data.containerType,
        ContainerSize: data.containerSize ?? "",
        TruckWeight: data.truckWeight ?? "",
        TypeID: data.typeID,
        TransporterID: data.transporterID,
        Active: data.active,
        // IsRGL: data.isRGL,
        IsBlack: data.isBlack,
        DriverLicenseNo: data.driverLicenseNo,
        VehicleBackRegNo: data.vehicleBackRegNo ?? "",
        Remarks: data.remarks ?? "",
        // LastPassedDate: moment(data.lastPassedDate).format('YYYY/MM/DD'),
      };
    this.service.updateTruck(formData)
        .pipe(catchError((err) => {
            this.spinner.hide();
            this.showError(err);
            return of({ status: false, messageContent: 'An error occurred while updating the truck.' });
        }))
        .subscribe((result) => {
            this.spinner.hide();
            if (result.status) {
                this.showSuccess('Truck Updated Successfully!');
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
