"use strict";(self.webpackChunktms_gate=self.webpackChunktms_gate||[]).push([[668],{6668:(x,h,a)=>{a.r(h),a.d(h,{OutCheckComponent:()=>y});var s=a(9417),c=a(9437),u=a(7673),C=a(7586),f=a.n(C),_=a(8032),l=a.n(_),p=a(27),e=a(3953),E=a(9812),g=a(6554),v=a(3782),d=a(8578),O=a(4088),T=a(3924);const k=["Grid"],I=()=>({text:"yardID",value:"yardID"});function b(n,w){if(1&n&&(e.j41(0,"div")(1,"span",59),e.EFF(2),e.k0s()()),2&n){const t=w.$implicit,r=e.XpG();e.R7$(),e.xc7("background-color",r.getBadgeColor(null==t?null:t.status)),e.R7$(),e.SpI(" ",(null==t?null:t.truckVehicleRegNo)||"N/A"," ")}}let y=(()=>{class n{constructor(t,r,o){this.service=t,this.spinner=r,this.router=o,this.pageSettings={pageSize:50},this.editSettings={allowEditing:!1,allowAdding:!0,allowDeleting:!0,mode:"Dialog"},this.toolbar=[{text:"Add",tooltipText:"Add",prefixIcon:"e-icons e-add",id:"detail"},"Delete","ExcelExport","Search"],this.lines="Both",this.submitClicked=!1,this.formatfilter="MM/dd/yyyy",this.yardList=[],this.endDate=new Date,this.today=new Date,this.placeholder="Select One"}ngOnInit(){this.mode="CheckBox",this.selectAllText="Select All",this.getLocationList(),this.optionForm=new s.gE({fromDate:new s.MJ(sessionStorage.getItem("ocfromDate")?sessionStorage.getItem("ocfromDate"):this.today,s.k0.required),toDate:new s.MJ(sessionStorage.getItem("octoDate")?sessionStorage.getItem("octoDate"):this.today,s.k0.required),yardID:new s.MJ(sessionStorage.getItem("ocloc")?sessionStorage.getItem("ocloc"):null,s.k0.required)})}getLocationList(){this.spinner.show(),this.service.getYardList("true").pipe((0,c.W)(t=>(0,u.of)(this.showError(t)))).subscribe(t=>{this.yardList=t,this.optionForm.controls.yardID.setValue(sessionStorage.getItem("ocloc")?sessionStorage.getItem("ocloc"):null),this.spinner.hide()})}loadTableData(){this.spinner.show();const t=this.optionForm.value,r=f()(t.fromDate).format("MM/DD/YYYY"),o=f()(t.toDate).format("MM/DD/YYYY");sessionStorage.setItem("ocfromDate",r),sessionStorage.setItem("octoDate",o),sessionStorage.setItem("ocloc",t.yardID),this.service.getOutBoundCheckList(r,o,t.yardID).pipe((0,c.W)(i=>(0,u.of)(this.showError(i)))).subscribe(i=>{this.grid.dataSource=i,this.grid.searchSettings.operator="equal",this.spinner.hide()})}actionBegin(t){if("delete"===t.requestType){t.cancel=!0;const o=t.data[0].outRegNo,i=localStorage.getItem("currentUser");this.deleteOutBoundCheck(o,i)}}getBadgeColor(t){switch(t){case"In(Check)":return" rgb(248, 144, 32)";case"In":return" rgb(171, 127, 195)";case"In(Weight)":return"#d83ad8";case"Operation":return"#0dcaf0";case"Out(Weight)":return"rgb(23, 117, 223)";case"Out(Check)":return"rgba(52, 187, 52, 0.8)";case"Out":return"rgb(23, 106, 23)";default:return"rgb(199, 73, 73)"}}formatParams(t){return t.map(r=>`'${r}'`).join(",")}deleteOutBoundCheck(t,r){l().fire({title:"Are you sure?",text:"You will not be able to recover this data!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",cancelButtonText:"No, keep it",confirmButtonText:"Yes, I am sure!"}).then(o=>{o.value?(this.spinner.show(),this.service.deleteOutBoundCheck(t,r).pipe((0,c.W)(i=>(0,u.of)(this.showError(i)))).subscribe(i=>{1==i.status?(this.showSuccess(i.messageContent),this.loadTableData()):(this.spinner.hide(),l().fire("Out Check(ICD/Other)",i.messageContent,"error"))})):o.dismiss===l().DismissReason.cancel&&l().close()})}showSuccess(t){this.spinner.hide(),l().fire("Out Check(ICD/Other)",t,"success")}showError(t){this.spinner.hide(),l().fire("Out Check(ICD/Other)",t.statusText,"error")}toolbarClick(t){if("Excel Export"===t.item.text&&this.grid.excelExport({fileName:"OutCheckICDOReport.xlsx"}),"detail"===t.item.id){let r=this.grid.getSelectedRecords();if(0!=r.length)return void("detail"===t.item.id&&this.router.navigate(["/tms-operation/out-check-doc"],{queryParams:{id:r[0].outRegNo}}));"detail"===t.item.id&&this.router.navigate(["/tms-operation/out-check-doc"],{queryParams:{id:null}})}}static#e=this.\u0275fac=function(r){return new(r||n)(e.rXU(E.C),e.rXU(g.ex),e.rXU(v.Ix))};static#t=this.\u0275cmp=e.VBU({type:n,selectors:[["app-out-check"]],viewQuery:function(r,o){if(1&r&&e.GBs(k,5),2&r){let i;e.mGM(i=e.lsd())&&(o.grid=i.first)}},standalone:!0,features:[e.aNF],decls:83,vars:19,consts:[["Grid",""],["template",""],[1,"content","mt-0"],[1,"container-fluid"],[1,"row"],[1,"col-md-12"],[1,"breadcrumb"],[1,"breadcrumb-item"],["routerLink","/","routerLinkActive","active"],[1,"nav-icon","fas","fa-tachometer-alt"],[1,"breadcrumb-item","active","text-primary"],[1,"card","card-primary","card-outline"],[1,"card-body"],[1,"col-md-12","col-lg-12","text-left"],[1,"card-title"],[3,"formGroup"],[1,"row","btns","mb-2"],[1,"col-lg-5","col-12"],["for","fromDate",1,"col-sm-4","col-form-label","requiredfield"],[1,"col-sm-8","p-0"],["formControlName","fromDate","floatLabelType","Always",3,"format"],["for","toDate",1,"col-sm-4","col-form-label","requiredfield"],["formControlName","toDate","floatLabelType","Always",3,"format"],[1,"row","mb-2"],[1,"col-sm-4","col-form-label","requiredfield"],["formControlName","yardID","placeholder","Select One","tabindex","4",3,"dataSource","fields"],[1,"col-lg-2","col-12","justify-content-end"],["type","button",1,"btn","btn-sm","btn-primary",3,"click","disabled"],[1,"fas","fa-eye"],[3,"actionBegin","toolbarClick","dataSource","allowResizing","allowSorting","allowPaging","pageSettings","editSettings","allowExcelExport","toolbar","gridLines"],["field","truckVehicleRegNo","headerText","Truck No","width","100"],["field","driverName","headerText","Driver Name","width","100"],["field","driverLicenseNo","headerText","Driver License No","width","150"],["field","driverContactNo","headerText","Driver Contact No","width","150"],["field","outPCCode","headerText","Category","width","100"],["field","groupName","headerText","Group Name","width","150"],["field","cardNo","headerText","Card No","width","100"],["field","customer","headerText","Customer","width","150"],["field","outCheckDateTime","headerText","Check Date Time","width","150"],["field","outYardID","headerText","Yard","width","150"],["field","outGateID","headerText","Gate","width","100"],["field","areaID","headerText","Area","width","100"],["field","outType","headerText","Type","width","100"],["field","outCargoType","headerText","CargoType","width","100"],["field","outCargoInfo","headerText","Cargo Info","width","100"],["field","truckType","headerText","Truck Type","width","100"],["field","outWeightBridgeID","headerText","Out WeightBridge","width","100"],["field","status","headerText","Status","width","100"],["field","remark","headerText","Remark","width","100"],["field","outRegNo","headerText","Out Check No","width","90",3,"isPrimaryKey","visible"],[1,"row","mt-3"],[1,"col-2","fw-bold"],[1,"col-10"],[1,"mx-1"],[1,"fa","fa-square","text-mediumSeaGreen","font-small-2","mr-1"],[1,"mx-2"],[1,"fa","fa-square","text-success","font-small-2","mr-1"],["bdColor","rgba(0, 0, 0, 0.8)","size","medium","color","#fff","type","square-jelly-box",3,"fullScreen"],[2,"color","white"],[1,"badge"]],template:function(r,o){if(1&r){const i=e.RV6();e.j41(0,"section",2)(1,"div",3)(2,"div",4)(3,"div",5)(4,"ol",6)(5,"li",7)(6,"a",8),e.nrm(7,"i",9),e.EFF(8,"\xa0Dashboard"),e.k0s()(),e.j41(9,"li",10),e.EFF(10,"Out Check(ICD/Other)"),e.k0s()()()(),e.j41(11,"div",4)(12,"div",11)(13,"div",12)(14,"div",4)(15,"div",13)(16,"h5",14),e.EFF(17,"Out Check(ICD/Other)"),e.k0s(),e.j41(18,"Form",15)(19,"div",16)(20,"div",17)(21,"div",4)(22,"label",18),e.EFF(23,"Date:"),e.k0s(),e.j41(24,"div",19),e.nrm(25,"ejs-datepicker",20),e.k0s()()(),e.j41(26,"div",17)(27,"div",4)(28,"label",21),e.EFF(29,"To:"),e.k0s(),e.j41(30,"div",19),e.nrm(31,"ejs-datepicker",22),e.k0s()()()(),e.j41(32,"div",23)(33,"div",17)(34,"div",4)(35,"label",24),e.EFF(36,"Yard:"),e.k0s(),e.j41(37,"div",19),e.nrm(38,"ejs-dropdownlist",25),e.k0s()()(),e.j41(39,"div",26)(40,"button",27),e.bIt("click",function(){return e.eBV(i),e.Njj(o.loadTableData())}),e.nrm(41,"i",28),e.EFF(42," \xa0 View "),e.k0s()()()()()(),e.j41(43,"ejs-grid",29,0),e.bIt("actionBegin",function(m){return e.eBV(i),e.Njj(o.actionBegin(m))})("toolbarClick",function(m){return e.eBV(i),e.Njj(o.toolbarClick(m))}),e.j41(45,"e-columns")(46,"e-column",30),e.DNE(47,b,3,3,"ng-template",null,1,e.C5r),e.k0s(),e.nrm(49,"e-column",31)(50,"e-column",32)(51,"e-column",33)(52,"e-column",34)(53,"e-column",35)(54,"e-column",36)(55,"e-column",37)(56,"e-column",38)(57,"e-column",39)(58,"e-column",40)(59,"e-column",41)(60,"e-column",42)(61,"e-column",43)(62,"e-column",44)(63,"e-column",45)(64,"e-column",46)(65,"e-column",47)(66,"e-column",48)(67,"e-column",49),e.k0s()(),e.j41(68,"div",50)(69,"div",51)(70,"span"),e.EFF(71,"Status :"),e.k0s()(),e.j41(72,"div",52)(73,"div")(74,"span",53),e.nrm(75,"i",54),e.EFF(76," Out(Check)"),e.k0s(),e.j41(77,"span",55),e.nrm(78,"i",56),e.EFF(79," Out"),e.k0s()()()()()()()()(),e.j41(80,"ngx-spinner",57)(81,"p",58),e.EFF(82," Loading... "),e.k0s()()}2&r&&(e.R7$(18),e.Y8G("formGroup",o.optionForm),e.R7$(7),e.Y8G("format",o.formatfilter),e.R7$(6),e.Y8G("format",o.formatfilter),e.R7$(7),e.Y8G("dataSource",o.yardList)("fields",e.lJ4(18,I)),e.R7$(2),e.Y8G("disabled",!o.optionForm.valid),e.R7$(3),e.Y8G("dataSource",o.data)("allowResizing",!0)("allowSorting",!0)("allowPaging",!0)("pageSettings",o.pageSettings)("editSettings",o.editSettings)("allowExcelExport",!0)("toolbar",o.toolbar)("gridLines",o.lines),e.R7$(24),e.Y8G("isPrimaryKey",!0)("visible",!1),e.R7$(13),e.Y8G("fullScreen",!0))},dependencies:[p.Q,s.BC,s.cb,s.j4,s.JD,d._ab,d.eeu,d.rFS,d.LGG,d.cvh,O.V9,T.I,g.et]})}return n})()}}]);