var pageData = [
  {
    name: "Service Page One",
    pageId: "service_page_one_page",
    schema: new SimpleSchema({
      qs1: {
        type: String,
        label: "What would you like?",
        max: 60,
        optional: true
      }
    })
  },{
    name: "Service Page Two",
    pageId: "service_page_two_page",
    schema: new SimpleSchema({
      qs2: {
        type: String,
        label: "What else?",
        max: 100,
        optional: true
      }
    })
  }
];

Template.wtInteractionService.helpers({
  pages: pageData
});