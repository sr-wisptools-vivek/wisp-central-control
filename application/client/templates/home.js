Template.home.helpers({
  content: function() {
    if (Meteor.settings.public.logos) {
      for (var x = 0; x < Meteor.settings.public.logos.length; x++) {
        if (Meteor.settings.public.logos[x].host === location.host)
          return Meteor.settings.public.logos[x].homeTemplate;
      }
    }
    return 'home-default';
  }
});
