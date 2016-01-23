
var myData;

$(document).ready(function(){
	initYearSelect();
});

function initYearSelect(){
	var currentTime = new Date();
	var year = currentTime.getFullYear();
	var select = document.getElementById('startYear');
	for (var i = year; i >= year - 30; i--) {
		select.options[select.options.length] = new Option(i,i);
	};
}

function clearEstimate(calledFromCalculate){
	$('#tblContainer').remove();
	if (!calledFromCalculate) {myData = "";
							   clearInput();
	                  		   toggleDataFields()};
}

function initData(){
	var yearSelect = document.getElementById('startYear');

	yearSelect.value = 2013;
	myData = new financialByYear(2012,31387,0);
	$("#startSalary").val("45600");
	$("#annualRaise").val("3600");
	$("#bonusPerc").val("3.2");
	$("#years").val("6");
	toggleDataFields('disabled');
	toggleInputImgs('pass');
}

function toggleDataFields(action){	
	var yearSelect = document.getElementById('startYear');
	var inputs = document.getElementsByTagName('input');
	for(var i = 0; i < inputs.length; i++){
	  if(inputs[i].type == 'text' && inputs[i].id != 'years'){
	    inputs[i].disabled = action;
	  }
	};
	yearSelect.disabled = action;
}

function toggleInputImgs(img){
	var inputDataIconclass;
	var inputDataIconId;
	var imgPath;
	if (img == 'pass') { 
		imgPath = "/images/greenCheck.png";
	} 
	else if (img == 'fail') {
		imgPath = "/images/redX.png";
	}
	else {
		imgPath = "/images/pencil.png";
	}

	$('img').each(function() {
		inputDataIconclass = $(this).attr('class');
		inputDataIconId = $(this).attr('id');console.log(inputDataIconId)
		if (inputDataIconclass == 'inputDataIcon'){		
			$('#'+inputDataIconId).attr('src',imgPath);
		}
	});

}

function clearInput(){
	var yearSelect = document.getElementById('startYear');
	var currentTime = new Date();
	var year = currentTime.getFullYear();
	var inputs = document.getElementsByTagName('input');
	for(var i = 0; i < inputs.length; i++){
	  if(inputs[i].type == 'text'){
	    inputs[i].value = "";
	  }
	};

	toggleInputImgs('reset');
	yearSelect.value = year;
}

function estimateBonus(){
	var yearSelect = document.getElementById("startYear");
	var startYear = Number(yearSelect.options[yearSelect.selectedIndex].text);
	var calculatedSalary = parseInt($('#startSalary').val());
	var raiseAmt    = parseInt($('#annualRaise').val());
	var bonusPerc   = parseFloat($('#bonusPerc').val()/100);
	var years       = parseInt($('#years').val());
	var runningSalary = 0;

	clearEstimate(1);
	addContainers();
	financials = [];

	for (var i = 0; i < years; i++) {
		financials[i] = new financialByYear(startYear+i,calculatedSalary,calcBonus(bonusPerc,i));
		runningSalary = runningSalary * bonusPerc + runningSalary + calculatedSalary;
		calculatedSalary = calculatedSalary+raiseAmt;
	};

	if (myData) {addTxt(myData.year,myData.salary,myData.bonusGross,myData.adjustedSalary)};
	for (var i = 0; i < financials.length; i++) {
		addTxt(financials[i].year,financials[i].salary,financials[i].bonusGross,financials[i].adjustedSalary)
	};
};

function calcBonus(bonusPerc,y){
	var currentBonus = 0;
	var runningSalary = 0;

	//take into account partial first year if using my personal data
	if (y==0&&myData) {runningSalary = myData.salary}

	for (var i = 0; i < financials.length; i++) {
		runningSalary += financials[i].salary
	};

	return roundNum(runningSalary*bonusPerc);
}

function financialByYear(year,salary,bonus){
	this.year = year;
	this.salary = salary;
	this.bonusGross = bonus;
	this.bonusNet = this.bonusGross*.62;
	this.adjustedSalary = parseInt(this.salary) + parseInt(this.bonusGross);
}

function roundNum(num){
	return (Math.round(num * 100) / 100).toFixed(2);
}

function addContainers(){ 
	var tblContainer = "<div id='tblContainer' style='height:25ex;overflow:auto'></div>"   
	if(!$('#tblContainer').length) {$('#bonusTableContainer').append(tblContainer)};
}

function addTxt(year,salary,bonusGross,adjSalary){
	var salaryData = "<div class="+addBkgnd(year)+">"+
					 "<div class='tblValue'>"+"Dec "+year+"</div>"+
					 "<div class='tblValue'>"+'$'+roundNum(salary)+"</div>"+
					 "<div class='tblValue'>"+'$'+roundNum(bonusGross)+"</div>"+
					 "<div class='tblValue'>"+'$'+roundNum(adjSalary)+"</div>"+
					 "</div>";
	$('#tblContainer').append(salaryData);
}

function addBkgnd(year){
	if (year%2!=0) {return 'tblValRowBkgnd'}else{return 'noBackground'}
}

function inputIcon(inputObj,inputImgId,type,precision){
	var enteredVal = $(inputObj).val();console.log(inputObj);
	var result = validateInput(enteredVal,type);

	if (!enteredVal) {
		$('#'+inputImgId).attr('src',"/images/pencil.png");
	}
	else if (result){
		$(inputObj).val(Number($(inputObj).val()).toFixed(precision));
		$('#'+inputImgId).attr('src',"/images/greenCheck.png");
	}
	else{
		$('#'+inputImgId).attr('src',"/images/redX.png");
	}
}

function validateInput(val,type){
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