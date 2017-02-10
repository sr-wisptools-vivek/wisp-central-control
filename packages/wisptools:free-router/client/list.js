Template.wtFreeRouterList.onCreated(function () {
  this.selStatus = new ReactiveVar('All');
  this.selDays = new ReactiveVar('7');
  WtFreeRouter.subscribe(searchFilter(this.selDays.get(), this.selStatus.get()), true, {createdAt: -1});
});

Template.wtFreeRouterList.helpers({
  items: function () {
    $('.router-list-msg').html('');
    // do the search
    var data = WtFreeRouter.find(searchFilter(Template.instance().selDays.get(), Template.instance().selStatus.get())).fetch();
    if(data == "")
      $('.router-list-msg').html('<div class="alert alert-danger" role="alert">No Results</div>');
    return data;
  },
  hasMore: function () {
    return Session.get('wtCollectionHasMoreRecords');
  },
  showSpinner: function () {
    return Session.get('wtCollectionLoading');
  },
});

Template.wtFreeRouterList.events({
  "click #showMoreBtn": function (e, t) {
    e.preventDefault();
    e.stopPropagation();
    WtFreeRouter.subscribe(searchFilter(t.selDays.get(), t.selStatus.get()), false, {createdAt: -1});
  },
  'click .md-archive-row': function (e, t) {
    e.preventDefault();
    e.stopPropagation();
    Router.go('wtFreeRouterDetails', {id: $(e.currentTarget).data('id')});
  },
  "change .filter-status": function(e, t) {
    e.preventDefault();
    e.stopPropagation();
    t.selStatus.set($(e.target).val());
    WtFreeRouter.subscribe(searchFilter(_this.selDays.get(), _this.selStatus.get()), true, {createdAt: -1});
  },
  "change .filter-date": function(e, t) {
    e.preventDefault();
    e.stopPropagation();
    t.selDays.set($(e.target).val());
    WtFreeRouter.subscribe(searchFilter(_this.selDays.get(), _this.selStatus.get()), true, {createdAt: -1});
  },  
});

var searchFilter = function (daysBack, status) {
  var _search = {};
  var _daysBack = new Date();
  var _unixTimeOneDay = 86400000;
  // Set the days back filter
  if (daysBack > 0) {
    _daysBack.setTime(_daysBack.getTime() - (daysBack * _unixTimeOneDay));
    _search.createdAt = {$gte: _daysBack};
  } else {
    _daysBack.setTime(_daysBack.getTime() - (30 * _unixTimeOneDay));
    _search.createdAt = {$gte: _daysBack};
  }
  // Set the status filter
  if (status != "All") {
    _search.status = status;
  }
  return _search;
};
