(function ($) {

	$.fn.loadInModal = function (childSelector) {

		createModal();

		this.on('click', childSelector, function (e) {
			e.preventDefault();
			showpopup(e.target.href);
		});

		return this;

	};

	function showpopup(url) {
		var heightOfModal = Math.floor($(document).height() * 0.8);
		var iframe = '<iframe style="width:100%;height:'+heightOfModal+'px;border:none;" id="iframeinmodal"></iframe>';
		$('#iframeinmodal').remove();
		$('#modalIframe').append(iframe);
		$('#iframeinmodal').attr('src', url);
		$('#modalforiframe').modal('show');
	}

	function createModal() {
		var modal = '<div class="modal fade" id="modalforiframe" role="dialog"><div class="modal-dialog modal-lg"><div class="modal-content"><div id="modalIframe" class="modal-body"></div></div></div></div></div>';
		$('body').append(modal);

	}

})(jQuery);