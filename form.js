//Take care of form behavior
//This is not for the instance.
//This is like form utility
//Requirement : autofill < https://github.com/creative-area/jQuery-form-autofill >
//Requirement : select2 < https://select2.github.io/ >
//Requirement : daterangerpicker < http://www.daterangepicker.com/ >
//@Author : Taehwa KIM

var Form = {
	//Autofill form (input, checkbox, radio. textarea)
	autofill : function(form, data){
		form.autofill(data);
	},

	//Select2 autofill
	//elem : selector
	//val : value. eg 'id'. (If you do not understand what is 'id', check select2 homepage)
	select2Autofill : function(elem, val){
		elem.val(val).trigger("change");
	},

	dateAutofill : function(elem, date){
		elem.datepicker({
			format : "dd/mm/yyyy",
			autoclose: true,
			startDate : date,
			forceParse : false
		});
	},

	//daterangepicker autofill
	daterangeAutofill : function(elem, startDate, endDate){

		//NOTE
		//It's using daterangepicker ver 2.1.18
		//Not daterangepicker from adminLTE.
		//adminLTE is using ver 1.3.21.
		//Have to know how to integrate 'adminLTE' and 'new daterangepicker' together.
		//Currently folders are separated.
		elem.daterangepicker({
			linkedCalendars : true,
			locale: {
				format: 'DD/MM/YYYY',
			},
			"startDate": startDate,
    		"endDate": endDate
		});

		elem.val(startDate + " - " +  endDate);
	},


	//Switch date format from French style to American style. EX : 20/04/2016 to 04/20/2016
	dateFr2Us : function(date){
		if(date == null) return;
		
		var d = date.split('/');
		var res = d[1] + '/' + d[0] + '/' + d[2];

		return res;
	},

	//Natively unchecked checkbox does not return any value
	//if you want to return a value when checkbox is unchecked (on form submit)
	//use this method
	uncheckboxValueReturner : function(checkElement, trueVal, falseVal){
		var name = checkElement.attr('name');	//Select hidden input together
		var $this = $("[name*='" + name + "']");
		var val = $this.val();
		
		if(val == trueVal){
			$this.val(falseVal);	
		}else{
			$this.val(trueVal);	
		} 
	}
}