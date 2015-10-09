function parseStr(str, array) {
     var strArr = String(str)
    .replace(/^&/, '')
    .replace(/&$/, '')
    .split('&'),
    sal = strArr.length,
    i, j, ct, p, lastObj, obj, lastIter, undef, chr, tmp, key, value,
    postLeftBracketPos, keys, keysLen,
    fixStr = function(str) {
      return decodeURIComponent(str.replace(/\+/g, '%20'));
    };

  if (!array) {
    array = this.window;
  }

  for (i = 0; i < sal; i++) {
    tmp = strArr[i].split('=');
    key = fixStr(tmp[0]);
    value = (tmp.length < 2) ? '' : fixStr(tmp[1]);

    while (key.charAt(0) === ' ') {
      key = key.slice(1);
    }
    if (key.indexOf('\x00') > -1) {
      key = key.slice(0, key.indexOf('\x00'));
    }
    if (key && key.charAt(0) !== '[') {
      keys = [];
      postLeftBracketPos = 0;
      for (j = 0; j < key.length; j++) {
        if (key.charAt(j) === '[' && !postLeftBracketPos) {
          postLeftBracketPos = j + 1;
        } else if (key.charAt(j) === ']') {
          if (postLeftBracketPos) {
            if (!keys.length) {
              keys.push(key.slice(0, postLeftBracketPos - 1));
            }
            keys.push(key.substr(postLeftBracketPos, j - postLeftBracketPos));
            postLeftBracketPos = 0;
            if (key.charAt(j + 1) !== '[') {
              break;
            }
          }
        }
      }
      if (!keys.length) {
        keys = [key];
      }
      for (j = 0; j < keys[0].length; j++) {
        chr = keys[0].charAt(j);
        if (chr === ' ' || chr === '.' || chr === '[') {
          keys[0] = keys[0].substr(0, j) + '_' + keys[0].substr(j + 1);
        }
        if (chr === '[') {
          break;
        }
      }

      obj = array;
      for (j = 0, keysLen = keys.length; j < keysLen; j++) {
        key = keys[j].replace(/^['"]/, '')
          .replace(/['"]$/, '');
        lastIter = j !== keys.length - 1;
        lastObj = obj;
        if ((key !== '' && key !== ' ') || j === 0) {
          if (obj[key] === undef) {
            obj[key] = {};
          }
          obj = obj[key];
        } else { // To insert new dimension
          ct = -1;
          for (p in obj) {
            if (obj.hasOwnProperty(p)) {
              if (+p > ct && p.match(/^\d+$/g)) {
                ct = +p;
              }
            }
          }
          key = ct + 1;
        }
      }
      lastObj[key] = value;
    }
  }
}


function serializeForm(form) {
      form = document.getElementById(form) || document.forms[0];
  var elems = form.elements;
  
  var serialized = [], i, len = elems.length, str='';
  
  for(i = 0; i < len; i += 1) {
  
    var element = elems[i];
    var type = element.type;
    var name = element.name;
    var value = element.value;
    
    switch(type) {
    
      case 'text':
      case 'radio':
      case 'checkbox':
      case 'textarea':
      case 'select-one':
      
      str = name + '=' + value;
      
      serialized.push(str);
      
      break;
      
      default:
      
      
        break;
        
    }    
  
  }
  
  return serialized.join('&');

}


Template.wtTowerEditFormModal.helpers({
	towerName: function (head) {
		if (typeof Session.get('selectedTowerMarker') != "undefined" && Session.get('selectedTowerMarker') != '') {
			return _.findWhere(MapControl.markers, {id: Session.get('selectedTowerMarker')}).title;
		} else {
			if (head == 'true')
				return 'Add Tower';
			else
				return '';
		}
	},
	towerLat: function () {
		if (typeof Session.get('selectedTowerMarker') != "undefined" && Session.get('selectedTowerMarker') != '') {
			return _.findWhere(MapControl.markers, {id: Session.get('selectedTowerMarker')}).getPosition().lat();
		} else {
			return '';
		}
	},
	towerLng: function () {
		if (typeof Session.get('selectedTowerMarker') != "undefined" && Session.get('selectedTowerMarker') != '') {
			return _.findWhere(MapControl.markers, {id: Session.get('selectedTowerMarker')}).getPosition().lng();
		} else {
			return '';
		}
	},
	btnContent: function () {
		if (typeof Session.get('selectedTowerMarker') != "undefined" && Session.get('selectedTowerMarker') != '') {
			return 'Save';
		} else {
			return 'Add';
		}
	},
	tower: function () {
		if (typeof Session.get('selectedTowerMarker') != "undefined" && Session.get('selectedTowerMarker') != '') {
			return WtTower.findOne({_id: Session.get('selectedTowerMarker')});
		}
	},
	log: function () {
		console.log(this);
	}
});

Template.wtTowerEditFormModal.events({
	'submit form': function (event) {
	
		if (typeof Session.get('selectedTowerMarker') != "undefined" && Session.get('selectedTowerMarker') != '') {
			//Update Tower
			var s;


			console.log(event.target['ap[][name]'].value);
			console.log(event.target['ap[][azimuth]'].value);
			console.log(event.target['ap[][beamwidth]'].value);
			console.log(event.target['ap[][distance]'].value);
			console.log(event.target['ap[][frequency]'].value);
			

			var color = $('.color[data-selected]').data('color');
			var name = event.target['ap[][name]'].value;
			var azimuth = event.target['ap[][azimuth]'].value;
			var beamwidth = event.target['ap[][beamwidth]'].value;
			var distance = event.target['ap[][distance]'].value;
			var frequency = event.target['ap[][frequency]'].value;

			s={
				'name': name,
				'azimuth': azimuth,
				'beamwidth': beamwidth,
				'distance': distance,
				'frequency': frequency,
				'color': color
			 }
			 console.log(s);
		

			// s={};parseStr(serializeForm(event.target),s);
			
			
			var ret = WtTower.update({_id: Session.get('selectedTowerMarker')}, {
				$set: {
					name: event.target.name.value,
					"loc.coordinates.0": event.target.lng.value,
					"loc.coordinates.1": event.target.lat.value,
					"accesspoints":[s]
				}
			});
			if (ret) {
				$.growl({
					icon: 'glyphicon glyphicon-ok',
					message: 'Updated Tower'
				},{
					type: 'success'
				});
			} else {
				$.growl({
					icon: 'glyphicon glyphicon-warning-sign',
					message: 'Update Failed. Please try again'
				},{
					type: 'danger'
				});
			}
		} else {
			//Add Tower
			var ret = WtTower.insert({
				name: event.target.name.value,
				loc: {
					type: 'Point',
					coordinates: [event.target.lng.value, event.target.lat.value]
				}
			});
			if (ret) {
				$.growl({
					icon: 'glyphicon glyphicon-ok',
					message: 'Added Tower'
				},{
					type: 'success'
				});
			} else {
				$.growl({
					icon: 'glyphicon glyphicon-warning-sign',
					message: 'Insert Failed. Please try again'
				},{
					type: 'danger'
				});
			}
		}
		$('#wtTowerEditFormModal').modal('hide');
		event.preventDefault();
		event.stopPropagation();
		return false;
	},
	'mousewheel #wtTowerEditFormModal': function (event) {
		if(event.originalEvent.wheelDelta /120 < 0) {
			$("#myCarousel").carousel('next');
		}
		else {
			$("#myCarousel").carousel('prev');
		}
	},
	'slid.bs.carousel #myCarousel': function () {
		$('.simplecolorpicker.fontawesome').show();
	}
});
