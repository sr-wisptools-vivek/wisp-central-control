AutoForm.addInputType("select-other", {
	template: "afSelectOther",
	valueOut: function () {
		if (this.val() == 'other') {
			other = $(this).parent().next().find('input#'+this.attr('name')+'_other').val();
			return (other == '') ? 'other' : other;
		} else {
			return this.val();
		}
	},
	contextAdjust: function (context) {
		if(typeof context.inputbox == "undefined") {
			context.inputbox = context.name + '_other';
		}
		context.selectoptions = [];
		$.each(context.selectOptions, function(i, e) {
			if (e.optgroup) {
				$.each(e.options, function(j, f) {
					if (typeof f !== "object") {
						context.selectOptions[i].options[j] = f = {label: f,value: f};
					}
					if (context.value == f.value) {
						_.extend(context.selectOptions[i].options[j],{selected: 'selected'});
					}
					context.selectoptions.push(f.value);
				});
			} else {
				if (typeof e !== "object") {
					context.selectOptions[i] = e = {label: e,value: e};
				}
				if (context.value == e.value) {
					_.extend(context.selectOptions[i],{selected: 'selected'});
				}
				context.selectoptions.push(e.value);
			}
		});
		if(_.indexOf(context.selectoptions, context.value) == -1) {
			if (context.value != 'other') context.inputboxvalue = context.value;
			if (context.value != "") context.selectedother = 'selected';
		} else {
			context.inputboxvalue = '';
		}
		return context;
	}
});

Template.afSelectOther.helpers({
	optionAtts: function () {
		var item = this;
		var atts = {
			value: item.value
		};
		if (item.selected) {
			atts.selected = '';
		}
		return atts;
	},
	atts: function () {
		var atts = _.clone(this.atts);
		atts = AutoForm.Utility.addClass(atts, 'form-control');
		return atts;
	}
});

Template.afSelectOther.events({
	'keyup input': function(event) {
		formId = $(event.currentTarget).parent().parent().parent().parent().attr('id');
		if ($("form#"+formId+" select[name='"+this.name+"']").val() == 'other')
			$("form#"+formId+" select[name='"+this.name+"']").trigger('change');
	}
});