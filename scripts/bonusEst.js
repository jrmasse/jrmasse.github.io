
var myData;
var dataCheck;

$(document).ready(function(){
	initYearSelect();
	dataCheck = new inputValidationObj();
});

function financialByYear(year,salary,bonus){	
	/*
	 -constructor for financialByYear obj
	*/	

	this.year           = year;
	this.salary         = salary;
	this.bonusGross     = bonus;
	this.bonusNet       = this.bonusGross*.62;
	this.adjustedSalary = parseInt(this.salary) + parseInt(this.bonusGross);
}

function inputValidationObj(){
	this.salaryInput = false;
	this.raiseInput  = false;
	this.bonusPerc   = false;
	this.yearsToCalc = false;
}

function initYearSelect(){
	/*
	 -initialize options for year selection dropdown
	 -current range is last thirty years
	 -year: current year
	*/

	var year   = new Date().getFullYear();
	var select = document.getElementById('startYear');

	for (var i = year; i >= year - 30; i--) {
		select.options[select.options.length] = new Option(i,i);
	};
}

function clearEstimate(calledFromCalculate){
	/*
	 -clear input data/reset year select/clear displayed calculated data
	 -if called for 'Calculate' button click only displayed table data will be removed
	 -calledFromCalculate: 'true' if called from Calculate button on click else 'false'
	*/	

	$('#tblContainer').remove();
	if (!calledFromCalculate) {myData = "";
							   clearInput();
	                  		   toggleDataFields();
	                  		   updateDataCheck('updateAll',false)};
}

function initData(){
	/*
	 -set values for my personal data on 'Use My Data' button click
	 -disable inputs and set icons
	*/	

	var yearSelect   = document.getElementById('startYear');
	yearSelect.value = 2013;
	myData           = new financialByYear(2012,31387,0);

	$("#startSalary").val("45600");
	$("#annualRaise").val("3600");
	$("#bonusPerc").val("3.2");
	$("#years").val("6");
	toggleDataFields('disabled');
	toggleInputImgs('pass');
	updateDataCheck('updateAll',true);
}

function toggleDataFields(action){	
	/*
	 -set input fields and select element to enabled/disabled
	 -action: 'true' to enable/'false' to disable
	*/	

	var yearSelect      = document.getElementById('startYear');
	var inputs          = document.getElementsByTagName('input');
	yearSelect.disabled = action;

	for(var i = 0; i < inputs.length; i++){
	  if(inputs[i].type == 'text' && inputs[i].id != 'years'){
	    inputs[i].disabled = action;
	  }
	};
}

function toggleInputImgs(img){
	/*
	 -set the img patch for all the icons displayed for inputs
	 -img: 'pass' for greenCheck/'fail' for redX/else pencil
	*/	

	var inputDataIconclass;
	var inputDataIconId;
	var imgPath;

	if (img == 'pass') {imgPath = "/images/greenCheck.png"} 
	else if (img == 'fail') {imgPath = "/images/redX.png"}
	else {imgPath = "/images/pencil.png"};

	$('img').each(function() {
		inputDataIconclass = $(this).attr('class');
		inputDataIconId = $(this).attr('id');console.log(inputDataIconId)
		if (inputDataIconclass == 'inputDataIcon'){		
			$('#'+inputDataIconId).attr('src',imgPath);
		}
	});

}

function clearInput(){
	/*
	 -clear data from all input fields
	 -reset year select value to current year
	*/	

	$('#hovMe').mouseover();

	var yearSelect = document.getElementById('startYear');
	var year       = new Date().getFullYear();
	var inputs     = document.getElementsByTagName('input');

	for(var i = 0; i < inputs.length; i++){
	  if(inputs[i].type == 'text'){
	    inputs[i].value = "";
	  }
	};

	toggleInputImgs('reset');
	yearSelect.value = year;
}

function estimateBonus(){
	/*
	 -calculate estimated bonus based on entered criteria
	 -data existing in table will be cleared/rebuilt
	*/	
	console.log(dataCheck);
	for(var key in dataCheck) {
    	if (dataCheck[key] == false){
    		alert("Invalid data entered");
    		return;
    	};
	}

	var yearSelect       = document.getElementById("startYear");
	var startYear        = Number(yearSelect.options[yearSelect.selectedIndex].text);
	var calculatedSalary = Number($('#startSalary').val());
	var raiseAmt         = Number($('#annualRaise').val());
	var bonusPerc        = Number($('#bonusPerc').val()/100);
	var years            = Number($('#years').val());
	var runningSalary    = 0;

	clearEstimate(1);
	addContainers();
	financials = [];

	for (var i = 0; i < years; i++) {
		financials[i] = new financialByYear(startYear+i,calculatedSalary,calcBonus(bonusPerc,i));
		runningSalary = runningSalary * bonusPerc + runningSalary + calculatedSalary;
		calculatedSalary = calculatedSalary+raiseAmt;
	};

	//take into account partial first year if using my personal data
	if (myData) {addTxt(myData.year,myData.salary,myData.bonusGross,myData.adjustedSalary)};

	for (var i = 0; i < financials.length; i++) {
		addTxt(financials[i].year,financials[i].salary,financials[i].bonusGross,financials[i].adjustedSalary)
	};
};

function calcBonus(bonusPerc,iteration){
	/*
	 -calculate culmulative bonus
	 -bonusPerc: entered bonus percentage
	 -iteration: position in for loop from calling function
	*/	

	var currentBonus  = 0;
	var runningSalary = 0;

	//take into account partial first year if using my personal data
	if (iteration==0&&myData) {runningSalary = myData.salary}

	for (var i = 0; i < financials.length; i++) {
		runningSalary += financials[i].salary
	};

	return roundNum(runningSalary*bonusPerc);
}

function roundNum(num){
	/*
	 -format number to 2 decimal points
	*/

	return (Math.round(num * 100) / 100).toFixed(2);
}

function addContainers(){ 
	/*
	 -add container div for table data to display calculated financials
	*/

	var tblContainer = "<div id='tblContainer' style='height:25ex;overflow:auto'></div>"   

	if(!$('#tblContainer').length) {$('#bonusTableContainer').append(tblContainer)};
}

function addTxt(year,salary,bonusGross,adjSalary){
	/*
	 -append element for calculated financial data
	 -year: year for financialsByYear obj instance
	 -salary: salary for financialsByYear obj instance
	 -bonusGross: calculated bonus for financialsByYear obj instance
	 -adjSalary: salary + bonusGross for financialsByYear obj instance 
	*/

	var salaryData = "<div class="+addBkgnd(year)+">"+
					 "<div class='tblValue'>"+"Dec "+year+"</div>"+
					 "<div class='tblValue'>"+'$'+roundNum(salary)+"</div>"+
					 "<div class='tblValue'>"+'$'+roundNum(bonusGross)+"</div>"+
					 "<div class='tblValue'>"+'$'+roundNum(adjSalary)+"</div>"+
					 "</div>";
	$('#tblContainer').append(salaryData);
}

function addBkgnd(year){
	/*
	 -return background color for odd rows
	*/

	if (year%2!=0) {return 'tblValRowBkgnd'}else{return 'noBackground'}
}

function inputIcon(inputObj,inputImgId,type,precision){
	
	/*
	 -return img src for icon based on input data
	 -inputObj: input element associated with icon
	 -inputImgId: img Id
	 -type: 'dec'/'yearCalc'/'either'
	*/
	
	var inputId    = $(inputObj).attr('id');
;	var enteredVal = $(inputObj).val();
	var result     = validateInput(enteredVal,type);

	if (!enteredVal) {
		$('#'+inputImgId).attr('src',"/images/pencil.png");
		updateDataCheck(inputId,false);
	}
	else if (result){
		$(inputObj).val(Number(enteredVal).toFixed(precision));
		$('#'+inputImgId).attr('src',"/images/greenCheck.png");
		updateDataCheck(inputId,true);
	}
	else{
		$('#'+inputImgId).attr('src',"/images/redX.png");
		updateDataCheck(inputId,false);
	}
	console.log(dataCheck)
}

function updateDataCheck(inputParam,val){
	switch(inputParam){
	case 'updateAll':
		dataCheck.salaryInput = val;
		dataCheck.raiseInput  = val;
		dataCheck.bonusPerc   = val;
		dataCheck.yearsToCalc = val;
		break;
	case 'startSalary':
		dataCheck.salaryInput = val;
		break;
	case 'annualRaise':
		dataCheck.raiseInput = val;
		break;
	case 'bonusPerc':
		dataCheck.bonusPerc = val;
		break;
	case 'years':
		dataCheck.yearsToCalc = val;
		break;
	default:
		'unexpected';
	};
	console.log(dataCheck);
}

function validateInput(val,type){
	/*
	 -test input to determine if valid
	 -val: data entered to input
	 -type: flag to determine how data in val arg should be tested
	*/

	var decTest = new RegExp(/^\d+(\.[0-9]{1,2})?$/);
	var intTest = new RegExp(/^\d+$/);
	//this will test for a 4 digit number. Changed Year input to Select so no longer needed
	// var yearTest = new RegExp(/^\d{4}$/);
	
	switch(type){
		case 'dec':
			return decTest.test(val);
			break;
		case 'yearCalc':
			return intTest.test(val) && val > 0;
			break;
		case 'either':
			return intTest.test(val) || decTest.test(val);
			break;
		default:
			return false;
	}
}