Template.accessPoint.rendered = function () {
	$('.simplecolorpicker').simplecolorpicker({theme: 'fontawesome'});
};

Template.accessPoint.helpers({
	colors: function () {
		return [
			{label:'Green', value: '#7bd148'},
			{label:'Bold Blue', value: '#5484ed'},
			{label:'Blue', value: '#5484ed'},
			{label:'Turquoise', value: '#46d6db'},
			{label:'Light Green', value: '#7ae7bf'},
			{label:'Bold Green', value: '#51b749'},
			{label:'Yellow', value: '#fbd75b'},
			{label:'Orange', value: '#ffb878'},
			{label:'Red', value: '#ff887c'},
			{label:'Bold Red', value: '#dc2127'},
			{label:'Purple', value: '#dbadff'},
			{label:'Gray', value: '#e1e1e1'}
		];
	},
	selectedColor: function (a,b) {
		if (typeof b.color != 'undefined')
			return (a==b.color) ? 'selected' : '';
	},
	log: function () {
		//console.log(this);
	}
});