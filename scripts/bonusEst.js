function clearEstimate(){
	$('#bonusEstTab').remove();
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

	addHeader();

	for (var i = 0; i < years; i++) {
		runningSalary = runningSalary * bonusPerc + runningSalary + calculatedSalary;
		addTxt(parseInt(startYear+i),calculatedSalary,roundNum(runningSalary*bonusPerc));
		calculatedSalary = calculatedSalary+raiseAmt;

	};
	calculatedBonus = roundNum(runningSalary * bonusPerc);
};

function roundNum(num){
	return (Math.round((num + 0.00001) * 100) / 100).toFixed(2);
}

function addHeader(){
	header = "<div style='width:75px; display:inline-block'>"+"Year"+"</div>"+
             "<div style='width:75px; display:inline-block'>"+"Salary"+"</div>"+
             "<div style='width:150px; display:inline-block; text-align:center'>"+"Est Bonus (gross)"+"</div>"+
             "<div style='width:150px; display:inline-block; text-align:center'>"+"Est Bonus (net)"+"</div>";          
	$('#bonusEstTab').append(header);
}

function addTxt(year,salary,curYearBonus){
	toAppend = "<div>"+
               "<div style='width:75px; display:inline-block'>"+year+"</div>"+
               "<div style='width:75px; display:inline-block'>"+salary+"</div>"+
               "<div style='width:150px; display:inline-block; text-align:center'>"+curYearBonus+"</div>"+
               "<div style='width:150px; display:inline-block; text-align:center'>"+roundNum(curYearBonus*.62)+"</div>"+
               "</div>";
	$('#bonusEstTab').append(toAppend);
}