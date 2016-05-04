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
		var heightOfModal = Math.floor($(document).height() * 0.8);
		var iframe = '<iframe style="width:100%;height:'+heightOfModal+'px;border:none;visibility:hidden;" onload="this.style.visibility = \'visible\';" id="iframeinmodal"></iframe>';
		$('#iframeinmodal').remove();
		$('#modalIframe').append(iframe);
		$('#iframeinmodal').attr('src', url);
		$('#modalforiframe').modal('show');
		callback();
	}

	function createModal() {
		var modal = '<div class="modal fade" id="modalforiframe" role="dialog"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h6 class="modal-title" id="myModalLabel">&nbsp;</h4></div><div id="modalIframe" style="background:url(/img/siteloader.gif) center center no-repeat;" class="modal-body"></div></div></div></div></div>';
		$('body').append(modal);

	}

})(jQuery);