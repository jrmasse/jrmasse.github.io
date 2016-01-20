function validateInput(input,type){
	var inputId = '#' + input.id;
	var decTest = /^\d*(\.\d{1})?\d{0,1}$/;
	data = $(inputId).val();
	if(data % 1 != 0){console.log("not number")}
}

function clearEstimate(){
	$('#bonusTableContainer').remove();
	$('#bonusEstTab').append("<div id='bonusTableContainer' style='width:85ex; margin-left:auto; margin-right:auto'></div>");	
	addHeader();
}

function initData(){
	$("#startYear").val("2013");
	$("#startSalary").val("45600");
	$("#annualRaise").val("3600");
	$("#bonusPerc").val("3.2");
	$("#years").val("6");
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

	clearEstimate();

	financials = [];
	financials[0] = new financialByYear(2012,31387,0);

	addHeader();

	for (var i = 0; i < years; i++) {

		financials[i+1] = new financialByYear(startYear+i,calculatedSalary,calcBonus(bonusPerc)),
		runningSalary = runningSalary * bonusPerc + runningSalary + calculatedSalary;
		// addTxt(parseInt(startYear+i),calculatedSalary,roundNum(runningSalary*bonusPerc));
		calculatedSalary = calculatedSalary+raiseAmt;
	};

	for (var i = 0; i < financials.length; i++) {
		addTxt(financials[i].year,financials[i].salary,financials[i].bonusGross,financials[i].adjustedSalary)
	};
};

function calcBonus(bonusPerc){
	var currentBonus = 0;
	var runningSalary = 0;
	for (var i = 0; i < financials.length; i++) {
		runningSalary += financials[i].salary;
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

function addHeader(){
	var header = "<div id='salaryHeader' class='blkLineBtm'>"+
			 	 "<div class='tblHeader'>"+"Year Ending"+"</div>"+
             	 "<div class='tblHeader'>"+"Annual Salary"+"</div>"+
             	 "<div class='tblHeader'>"+"Est Bonus"+"</div>"+
             	 "<div class='tblHeader'>"+"Adjusted Salary"+"</div>"
             	 "</div>";      
	if(!$('#salaryHeader').length) {$('#bonusTableContainer').append(header)};
}

function addTxt(year,salary,bonusGross,adjSalary){
	var salaryData = "<div class="+addBkgnd(year)+">"+
                     "<div class='tblValue'>"+"Dec "+year+"</div>"+
                     "<div class='tblValue'>"+'$'+roundNum(salary)+"</div>"+
                     "<div class='tblValue'>"+'$'+roundNum(bonusGross)+"</div>"+
                     "<div class='tblValue'>"+'$'+roundNum(adjSalary)+"</div>"+
                     "</div>";
	$('#bonusTableContainer').append(salaryData);
}

function addBkgnd(year){
	if (year%2!=0) {return 'tblValRowBkgnd'}
}