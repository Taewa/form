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

	convertSelect2Data : function(d){
		var id = d.id.length;

		if(id <= 0){
			return [];
		} 
		var arr = new Array();

		for(var i = 0; i < id; i ++){
			arr.push(d.id[i]);
		}
		return arr;
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

	//Switch date format from French style to MySqul default format. EX : 20/04/2016 to 2016-04-20
	dateMysql : function(date){
		if(date == null || date == undefined || date == '') return;
		
		var d = date.split('/');
		var res = d[2] + '-' + d[1] + '-' + d[0];
		
		return res;
	},

	//Switch date format from MySqul style to French style format. EX : 2016-04-20 to 20/04/2016 
	dateUnMysql : function(date){
		if(date == null || date == undefined || date == '') return;
		
		var d = date.split('-');
		var res = d[2] + '/' + d[1] + '/' + d[0];
		
		return res;
	},

	//Switch date AND time format from MySqul style to French style format. EX : 2016-04-25 10:24:48 to 25/04/2016 10:24:48
	dateAndTimeUnMysql : function(dateAndTime){
		if(dateAndTime == null || dateAndTime == undefined || dateAndTime == '') return;
		
		var res;
		var arr = dateAndTime.split(' ');

		var d = arr[0].split('-');
		var date = d[2] + '/' + d[1] + '/' + d[0];

		res = date + ' ' + arr[1];

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
	},

	//Return checkbox value as string in array (It returns only checked one)
	//EX : ['check1', 'check4'];
	checkboxToString : function(target){
		var res = [];
		var checkbox = target.find('input[type="checkbox"]').filter(':checked');

		checkbox.each(function(i){
			var v = $(this).data('val');
			res.push(v);
		});

		return res;
	},

	//Return form data json.
	//Adjust checkbox value using parameter 'valObj'
	formSerializeArray : function(formElem, valObj){
		var res;
		var valObj = valObj || {};
		var checkedVal = valObj.checkVal != undefined ? valObj.checkVal : '1';
		var uncheckedVal = valObj.uncheckVal != undefined? valObj.uncheckedVal : '0';

		//In case formElem is 'form'
		if(formElem.is('form')){
			
			res = formElem.serializeArray().reduce(function(obj, item) {

				if(item.name in obj){	//Check for multiple item. If there is multiple, create an array.
					var ogirinalVal = obj[item.name];
					var targetType = obj[item.name] instanceof Array

					if(targetType){	//An array
						obj[item.name].push(item.value);
						
					}else{	//Means it's first
						obj[item.name] = [];
						obj[item.name].push(ogirinalVal);
						obj[item.name].push(item.value);	
					}

				}else{
					obj[item.name] = item.value;	
				}

			    
				return obj;
			}, {});
		}else{	//Other elements
			d = formElem.find(':input').serializeArray();
		
			res = {};
			
			$.each(d, function(i){
				var item = d[i];
				res[item.name] = item.value;
			});
		}


		//jQuery.formSerializeArray does not support checkbox serializing
		var checkBoxSerialized = formElem.find('input:checkbox').map(function() {
			var val = this.checked ? checkedVal : uncheckedVal;

			return { name: this.name, value: val};
		});
		

		$.each(checkBoxSerialized, function(i){
			res[checkBoxSerialized[i]['name']] = checkBoxSerialized[i]['value'];
		});

		return res;
	},

	//Dependency : bootstrap-validator < https://github.com/1000hz/bootstrap-validator >
	//Bootstrap-validator v0.10.2 does not support 'at least one checkbox required' validation.
	//There is some way here < https://github.com/1000hz/bootstrap-validator/issues/201#issuecomment-226559874 >
	//But I don't want to use non-master version.
	checkboxValidator : function(group, form, goal, time){
		var isChecked = false;
		var goal = goal || 1;	//Default at least one checkbox
		var time = time || 500;

		setTimeout(function(){
			if(group.filter(':checked').length >= goal){
				isChecked = true;
			}

			group.not(':checked').prop('required', !isChecked);
			form.validator('destroy').validator();
		}, time);
	}
}