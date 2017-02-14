Template.header.helpers({
  logoUrl: function() {
    if (Meteor.settings.public.logos) {
      for (var x = 0; x < Meteor.settings.public.logos.length; x++) {
        if (Meteor.settings.public.logos[x].host === location.host)
          return Meteor.settings.public.logos[x].logoUrl;
      }
    }
    return '/readynet.png';
  }
});
