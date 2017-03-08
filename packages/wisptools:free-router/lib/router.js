Router.route('/free-router', {
  name: 'wtFreeRouterForm',
  template: 'wtFreeRouterForm'
});

Router.route('/free-router-list', {
  name: 'wtFreeRouterList',
  template: 'wtFreeRouterList'
});

Router.route('/free-router/view/:itemId', {
  name: 'wtFreeRouterDetails',
  template: 'wtFreeRouterDetails',
  subscriptions: function() {
    return [
      WtFreeRouter.subscribe({ _id: this.params.itemId }),
    ];
  },
  data: function() {
    return { itemId: this.params.itemId };
  },
});