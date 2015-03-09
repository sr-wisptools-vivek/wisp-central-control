AutoForm.addInputType("select-other", {
	template: "afSelectOther",
	valueOut: function () {
		if (this.val() == 'other') {
			return $("#"+this.attr('name')+"_other").val();
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
					if (context.value!="" && context.value == f.value) {
						_.extend(context.selectOptions[i].options[j],{selected: 'selected'});
					}
					context.selectoptions.push(f.value);
				});
			} else {
				if (typeof e !== "object") {
					context.selectOptions[i] = e = {label: e,value: e};
				}
				if (context.value !="" && context.value == e.value) {
					_.extend(context.selectOptions[i],{selected: 'selected'});
				}
				context.selectoptions.push(e.value);
			}
		});
		if(context.value!="" && _.indexOf(context.selectoptions, context.value) == -1) {
			context.inputboxvalue = context.value;
			context.selectedother = 'selected';
		} else {
			context.inputboxvalue = '';
			context.selectedother = '';
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