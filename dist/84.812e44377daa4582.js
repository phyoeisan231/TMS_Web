"use strict";(self.webpackChunktms_gate=self.webpackChunktms_gate||[]).push([[84],{9084:(y,f,a)=>{a.r(f),a.d(f,{TmsInCheckComponent:()=>x});var _=a(27),n=a(9417),m=a(9437),u=a(7673),D=a(7586),g=a.n(D),T=a(8032),s=a.n(T),e=a(3953),C=a(620),p=a(6554),E=a(3782),d=a(8578),I=a(4088),k=a(3924);const v=["Grid"],b=()=>({text:"yardID",value:"yardID"});function w(l,B){if(1&l&&(e.j41(0,"div")(1,"span",68),e.EFF(2),e.k0s()()),2&l){const t=B.$implicit,o=e.XpG();e.R7$(),e.xc7("background-color",o.getBadgeColor(null==t?null:t.status)),e.R7$(),e.SpI(" ",(null==t?null:t.truckVehicleRegNo)||"N/A"," ")}}let x=(()=>{class l{constructor(t,o,i){this.service=t,this.spinner=o,this.router=i,this.pageSettings={pageSize:50},this.editSettings={allowEditing:!1,allowAdding:!0,allowDeleting:!0,mode:"Dialog"},this.toolbar=[{text:"Detail",tooltipText:"Detail",prefixIcon:"e-icons e-selection",id:"detail"},"Delete","ExcelExport","Search"],this.lines="Both",this.submitClicked=!1,this.formatfilter="MM/dd/yyyy",this.yardList=[],this.endDate=new Date,this.today=new Date,this.placeholder="Select One"}ngOnInit(){this.mode="CheckBox",this.selectAllText="Select All",this.getLocationList(),this.optionForm=new n.gE({fromDate:new n.MJ(sessionStorage.getItem("icfromDate")?sessionStorage.getItem("icfromDate"):this.today,n.k0.required),toDate:new n.MJ(sessionStorage.getItem("ictoDate")?sessionStorage.getItem("ictoDate"):this.today,n.k0.required),yardID:new n.MJ(sessionStorage.getItem("icloc")?sessionStorage.getItem("icloc"):null,n.k0.required)})}getLocationList(){this.spinner.show(),this.service.getYardList("true").pipe((0,m.W)(t=>(0,u.of)(this.showError(t)))).subscribe(t=>{this.yardList=t,this.optionForm.controls.yardID.setValue(sessionStorage.getItem("icloc")?sessionStorage.getItem("icloc"):null),this.spinner.hide()})}loadTableData(){this.spinner.show();const t=this.optionForm.value,o=g()(t.fromDate).format("MM/DD/YYYY"),i=g()(t.toDate).format("MM/DD/YYYY");sessionStorage.setItem("icfromDate",o),sessionStorage.setItem("ictoDate",i),sessionStorage.setItem("icloc",t.yardID),this.service.getInBoundCheckTMSList(o,i,t.yardID).pipe((0,m.W)(r=>(0,u.of)(this.showError(r)))).subscribe(r=>{this.grid.dataSource=r,this.grid.searchSettings.operator="equal",this.spinner.hide()})}actionBegin(t){if("delete"===t.requestType){t.cancel=!0;const i=t.data[0].inRegNo,r=localStorage.getItem("currentUser");this.deleteInBoundCheck(i,r)}}formatParams(t){return t.map(o=>`'${o}'`).join(",")}getBadgeColor(t){switch(t){case"In(Check)":return" rgb(248, 144, 32)";case"In":return" rgb(171, 127, 195)";case"In(Weight)":return"#d83ad8";case"Operation":return"#0dcaf0";case"Out(Weight)":return"rgb(23, 117, 223)";case"Out(Check)":return"rgba(52, 187, 52, 0.8)";case"Out":return"rgb(23, 106, 23)";default:return"rgb(199, 73, 73)"}}deleteInBoundCheck(t,o){s().fire({title:"Are you sure?",text:"You will not be able to recover this data!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",cancelButtonText:"No, keep it",confirmButtonText:"Yes, I am sure!"}).then(i=>{i.value?(this.spinner.show(),this.service.deleteInBoundCheck(t,o).pipe((0,m.W)(r=>(0,u.of)(this.showError(r)))).subscribe(r=>{1==r.status?(this.showSuccess(r.messageContent),this.loadTableData()):(this.spinner.hide(),s().fire("In Check(TMS)",r.messageContent,"error"))})):i.dismiss===s().DismissReason.cancel&&s().close()})}showSuccess(t){this.spinner.hide(),s().fire("In Check(TMS)",t,"success")}showError(t){this.spinner.hide(),s().fire("In Check(TMS)",t.statusText,"error")}toolbarClick(t){if("Excel Export"===t.item.text&&this.grid.excelExport({fileName:"InCheckTMSReport.xlsx"}),"detail"===t.item.id){let o=this.grid.getSelectedRecords();if(0!=o.length)return void("detail"===t.item.id&&this.router.navigate(["/tms-operation/tms-in-check-proposal-doc"],{queryParams:{poNo:o[0].propNo,id:o[0].inRegNo,truck:o[0].truckVehicleRegNo}}));s().fire("In Check(TMS)","Please select one row!","warning")}}static#e=this.\u0275fac=function(o){return new(o||l)(e.rXU(C.$),e.rXU(p.ex),e.rXU(E.Ix))};static#t=this.\u0275cmp=e.VBU({type:l,selectors:[["app-tms-in-check"]],viewQuery:function(o,i){if(1&o&&e.GBs(v,5),2&o){let r;e.mGM(r=e.lsd())&&(i.grid=r.first)}},standalone:!0,features:[e.aNF],decls:100,vars:20,consts:[["Grid",""],["template",""],[1,"content","mt-0"],[1,"container-fluid"],[1,"row"],[1,"col-md-12"],[1,"breadcrumb"],[1,"breadcrumb-item"],["routerLink","/","routerLinkActive","active"],[1,"nav-icon","fas","fa-tachometer-alt"],[1,"breadcrumb-item","active","text-primary"],[1,"card","card-primary","card-outline"],[1,"card-body"],[1,"col-md-12","col-lg-12","text-left"],[1,"card-title"],[3,"formGroup"],[1,"row","btns","mb-2"],[1,"col-lg-5","col-12"],["for","fromDate",1,"col-sm-4","col-form-label","requiredfield"],[1,"col-sm-8","p-0"],["formControlName","fromDate","floatLabelType","Always",3,"format"],["for","toDate",1,"col-sm-4","col-form-label","requiredfield"],["formControlName","toDate","floatLabelType","Always",3,"format"],[1,"row","mb-2"],[1,"col-sm-4","col-form-label","requiredfield"],["formControlName","yardID","placeholder","Select One","tabindex","3",3,"dataSource","fields"],[1,"col-lg-2","col-12","justify-content-end"],["type","button",1,"btn","btn-sm","btn-primary",3,"click","disabled"],[1,"fas","fa-eye"],[3,"actionBegin","toolbarClick","dataSource","allowResizing","allowSorting","allowPaging","pageSettings","editSettings","allowExcelExport","toolbar","gridLines"],["field","truckVehicleRegNo","headerText","Truck No","width","100"],["field","driverName","headerText","Driver Name","width","150"],["field","driverLicenseNo","headerText","Driver License No","width","150"],["field","driverContactNo","headerText","Driver Contact No","width","150"],["field","inPCCode","headerText","Category","width","100"],["field","groupName","headerText","Group Name","width","150"],["field","cardNo","headerText","Card No","width","100"],["field","customer","headerText","Customer","width","150"],["field","inCheckDateTime","headerText","Check Date Time","width","150"],["field","inYardID","headerText","Yard","width","150"],["field","inGateID","headerText","Gate","width","100"],["field","areaID","headerText","Area","width","100"],["field","inType","headerText","Type","width","100"],["field","inCargoType","headerText","CargoType","width","100"],["field","inCargoInfo","headerText","Cargo Info","width","100"],["field","truckType","headerText","Truck Type","width","100"],["field","inWeightBridgeID","headerText","In WeightBridge","width","100"],["field","outWeightBridgeID","headerText","Out WeightBridge","width","100"],["field","isUseWB","headerText","Use WB?","width","100"],["field","inWBBillOption","headerText","In WB BillOption","width","100"],["field","outWBBillOption","headerText","Out WB BillOption","width","100"],["field","status","headerText","Status","width","100"],["field","remark","headerText","Remark","width","100"],["field","inRegNo","headerText","In Check No","width","90",3,"isPrimaryKey","visible"],["field","propNo","headerText","Prop No","width","90",3,"visible"],[1,"mt-3"],[1,"mx-3"],[1,"fa","fa-square","font-small-2","mr-1",2,"color","rgb(248, 144, 32)"],[1,"fa","fa-square","font-small-2","mr-1",2,"color","rgb(171, 127, 195)"],[1,"fa","fa-square","text-orchid","font-small-2","mr-1"],[1,"mx-2"],[1,"fa","fa-square","text-info","font-small-2","mr-1"],[1,"fa","fa-square","text-primary","font-small-2","mr-1"],[1,"mx-1"],[1,"fa","fa-square","text-mediumSeaGreen","font-small-2","mr-1"],[1,"fa","fa-square","text-success","font-small-2","mr-1"],["bdColor","rgba(0, 0, 0, 0.8)","size","medium","color","#fff","type","square-jelly-box",3,"fullScreen"],[2,"color","white"],[1,"badge"]],template:function(o,i){if(1&o){const r=e.RV6();e.j41(0,"section",2)(1,"div",3)(2,"div",4)(3,"div",5)(4,"ol",6)(5,"li",7)(6,"a",8),e.nrm(7,"i",9),e.EFF(8,"\xa0Dashboard"),e.k0s()(),e.j41(9,"li",10),e.EFF(10,"In Check(TMS)"),e.k0s()()()(),e.j41(11,"div",4)(12,"div",11)(13,"div",12)(14,"div",4)(15,"div",13)(16,"h5",14),e.EFF(17,"In Check(TMS)"),e.k0s(),e.j41(18,"Form",15)(19,"div",16)(20,"div",17)(21,"div",4)(22,"label",18),e.EFF(23,"Date:"),e.k0s(),e.j41(24,"div",19),e.nrm(25,"ejs-datepicker",20),e.k0s()()(),e.j41(26,"div",17)(27,"div",4)(28,"label",21),e.EFF(29,"To:"),e.k0s(),e.j41(30,"div",19),e.nrm(31,"ejs-datepicker",22),e.k0s()()()(),e.j41(32,"div",23)(33,"div",17)(34,"div",4)(35,"label",24),e.EFF(36,"Yard:"),e.k0s(),e.j41(37,"div",19),e.nrm(38,"ejs-dropdownlist",25),e.k0s()()(),e.j41(39,"div",26)(40,"button",27),e.bIt("click",function(){return e.eBV(r),e.Njj(i.loadTableData())}),e.nrm(41,"i",28),e.EFF(42," \xa0 View "),e.k0s()()()()()(),e.j41(43,"ejs-grid",29,0),e.bIt("actionBegin",function(h){return e.eBV(r),e.Njj(i.actionBegin(h))})("toolbarClick",function(h){return e.eBV(r),e.Njj(i.toolbarClick(h))}),e.j41(45,"e-columns")(46,"e-column",30),e.DNE(47,w,3,3,"ng-template",null,1,e.C5r),e.k0s(),e.nrm(49,"e-column",31)(50,"e-column",32)(51,"e-column",33)(52,"e-column",34)(53,"e-column",35)(54,"e-column",36)(55,"e-column",37)(56,"e-column",38)(57,"e-column",39)(58,"e-column",40)(59,"e-column",41)(60,"e-column",42)(61,"e-column",43)(62,"e-column",44)(63,"e-column",45)(64,"e-column",46)(65,"e-column",47)(66,"e-column",48)(67,"e-column",49)(68,"e-column",50)(69,"e-column",51)(70,"e-column",52)(71,"e-column",53)(72,"e-column",54),e.k0s()(),e.j41(73,"div",55)(74,"span",56),e.EFF(75,"Status:"),e.k0s(),e.j41(76,"span"),e.nrm(77,"i",57),e.EFF(78," In(Check)"),e.k0s(),e.j41(79,"span",56),e.nrm(80,"i",58),e.EFF(81," In"),e.k0s(),e.j41(82,"span",56),e.nrm(83,"i",59),e.EFF(84," In(Weight)"),e.k0s(),e.j41(85,"span",60),e.nrm(86,"i",61),e.EFF(87," Operation"),e.k0s(),e.j41(88,"span"),e.nrm(89,"i",62),e.EFF(90," Out(Weight)"),e.k0s(),e.j41(91,"span",63),e.nrm(92,"i",64),e.EFF(93," Out(Check)"),e.k0s(),e.j41(94,"span",60),e.nrm(95,"i",65),e.EFF(96," Out"),e.k0s()()()()()()(),e.j41(97,"ngx-spinner",66)(98,"p",67),e.EFF(99," Loading... "),e.k0s()()}2&o&&(e.R7$(18),e.Y8G("formGroup",i.optionForm),e.R7$(7),e.Y8G("format",i.formatfilter),e.R7$(6),e.Y8G("format",i.formatfilter),e.R7$(7),e.Y8G("dataSource",i.yardList)("fields",e.lJ4(19,b)),e.R7$(2),e.Y8G("disabled",!i.optionForm.valid),e.R7$(3),e.Y8G("dataSource",i.data)("allowResizing",!0)("allowSorting",!0)("allowPaging",!0)("pageSettings",i.pageSettings)("editSettings",i.editSettings)("allowExcelExport",!0)("toolbar",i.toolbar)("gridLines",i.lines),e.R7$(28),e.Y8G("isPrimaryKey",!0)("visible",!1),e.R7$(),e.Y8G("visible",!1),e.R7$(25),e.Y8G("fullScreen",!0))},dependencies:[_.Q,n.BC,n.cb,n.j4,n.JD,d._ab,d.eeu,d.rFS,d.LGG,d.cvh,I.V9,k.I,p.et]})}return l})()}}]);