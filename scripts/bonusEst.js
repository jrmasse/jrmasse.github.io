
var myData;

function validateInput(input,type){
	var inputId = '#' + input.id;
	var decTest = /^\d*(\.\d{1})?\d{0,1}$/;
	data = $(inputId).val();
	if(data % 1 != 0){console.log("not number")}
}

function clearEstimate(calledFromCalculate){
	$('#tblContainer').remove();
	if (!calledFromCalculate) {myData = "";
							   clearInput();
	                  		   toggleInput()};
}

function initData(){
	myData = new financialByYear(2012,31387,0);

	$("#startYear").val("2013");
	$("#startSalary").val("45600");
	$("#annualRaise").val("3600");
	$("#bonusPerc").val("3.2");
	$("#years").val("6");
	toggleInput('disabled')
}

function toggleInput(action){
	var inputs = document.getElementsByTagName('input');
	for(var i = 0; i < inputs.length; i++){
	  if(inputs[i].type == 'text' && inputs[i].id != 'years'){
	    inputs[i].disabled = action;
	  }
	}
}

function clearInput(){
	// $(':input').val('');
	var inputs = document.getElementsByTagName('input');
	for(var i = 0; i < inputs.length; i++){
	  if(inputs[i].type == 'text'){
	    inputs[i].value = "";
	  }
	}	
}

function estimateBonus(){
	var startYear = parseInt($('#startYear').val());
	var startSalary = parseInt($('#startSalary').val());
	var raiseAmt    = parseInt($('#annualRaise').val());
	var bonusPerc   = parseFloat($('#bonusPerc').val()/100);
	var years       = parseInt($('#years').val());
	var calculatedSalary = startSalary;
	var runningSalary = 0;
	var calculatedBonus = 0;

	clearEstimate(1);
	addContainers();
	financials = [];

	for (var i = 0; i < years; i++) {
		financials[i] = new financialByYear(startYear+i,calculatedSalary,calcBonus(bonusPerc));
		runningSalary = runningSalary * bonusPerc + runningSalary + calculatedSalary;
		calculatedSalary = calculatedSalary+raiseAmt;
	};

	if (myData) {addTxt(myData.year,myData.salary,myData.bonusGross,myData.adjustedSalary)};
	for (var i = 0; i < financials.length; i++) {
		addTxt(financials[i].year,financials[i].salary,financials[i].bonusGross,financials[i].adjustedSalary)
	};
};

function calcBonus(bonusPerc){
	var currentBonus = 0;
	var runningSalary = 0;
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