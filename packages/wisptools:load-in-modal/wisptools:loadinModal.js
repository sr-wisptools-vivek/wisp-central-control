(function ($) {

	$.fn.loadInModal = function (childSelector, callback) {

		createModal();

		this.on('click', childSelector, function (e) {
			e.preventDefault();
			showpopup(e.target.href, callback);
		});

		return this;

	};

	function showpopup(url, callback) {
		
		var iframe = '<iframe style="width:100%;border:none;" id="iframeinmodal"></iframe>';
		$('#iframeinmodal').remove();
		$('#modalIframe').append(iframe);
		$('#iframeinmodal').attr('src', url);
		$('#modalforiframe').modal('show');
		$('#siteloader-content').show();
		callback();
	}

	function createModal() {
		var modal = '<div class="modal fade modal-container loadInModal" id="modalforiframe" role="dialog"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h6 class="modal-title" id="myModalLabel">&nbsp;</h4></div><div id="modalIframe" class="modal-body"><div id="siteloader-content"><h3>Fetching Data From Device</h3><img id="loader" src="/img/siteloader.gif"/></div></div></div></div></div></div>';
		$('body').append(modal);
		//var heightOfModal = Math.floor($(document).height() * 0.8);
		//$('#modalIframe').css('height',heightOfModal+'px');

	}

})(jQuery);