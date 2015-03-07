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
    $.each(context.selectOptions, function(i, e){
      if (e.optgroup) {
        $.each(e.options, function(j,f) {
          if (context.value == f.value) {
            _.extend(context.selectOptions[i].e.options[j],{selected: 'selected'});
          }
          context.selectoptions.push(f.value);
        });
      } else {
        if (context.value == e.value) {
          _.extend(context.selectOptions[i].e,{selected: 'selected'});
        }
        context.selectoptions.push(e.value);
      }
    });
    if(_.indexOf(context.selectoptions, context.value) == -1) {
      context.inputboxvalue = context.value;
    } else {
      context.inputboxvalue = '';
    }
    return context;
  }
});

Template.afSelectOther.helpers({
  log: function() {
    //console.log(this);
  },
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
    atts = _.extend(atts, {
      style: "width: 49%;margin-right: 5px;"
    });
    return atts;
  }
});

Template.afSelectOther.events({
  'change select': function(event) {
    if(event.currentTarget.value != 'other') {
      //alert(event.currentTarget.name);
      //alert($('#'+event.currentTarget.name+'_other').val());
    }
  }
});

Template.afSelectOther.rendered = function () {
  context = this.data;
  context.selectoptions = [];
  $.each(context.selectOptions, function(i, e){
    if (e.optgroup) {
      $.each(e.options, function(j,f) {
        if (context.value == f.value) {
          _.extend(context.selectOptions[i].e.options[j],{selected: 'selected'});
        }
        context.selectoptions.push(f.value);
      });
    } else {
      if (context.value == e.value) {
        _.extend(context.selectOptions[i].e,{selected: 'selected'});
      }
      context.selectoptions.push(e.value);
    }
  });
  //console.log(context.selectoptions);
  
};