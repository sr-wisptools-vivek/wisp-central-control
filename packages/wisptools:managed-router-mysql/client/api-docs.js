Template.wtManagedRouterMySQLAPI.helpers({
  tabData: {
    showTitle: false,
    title: "API",
    pages: [
      {
        tabName: "Authenticate",
        tabId: "api_doc_authenticate",
        tabTemplate: "wtManagedRouterMySQLAPIAuthentication"
      },{
        tabName: "Search",
        tabId: "api_doc_search",
        tabTemplate: "wtManagedRouterMySQLAPISearch"
      },{
        tabName: "Add",
        tabId: "api_doc_add",
        tabTemplate: "wtManagedRouterMySQLAPIAdd"
      },{
        tabName: "Update",
        tabId: "api_doc_update",
        tabTemplate: "wtManagedRouterMySQLAPIUpdate"
      },{
        tabName: "Delete",
        tabId: "api_doc_delete",
        tabTemplate: "wtManagedRouterMySQLAPIDelete"
      },{
        tabName: "Restore",
        tabId: "api_doc_restore",
        tabTemplate: "wtManagedRouterMySQLAPIRestore"
      },{
        tabName: "Reserve",
        tabId: "api_doc_reserve",
        tabTemplate: "wtManagedRouterMySQLAPIReserve"
      },{
        tabName: "Advanced",
        tabId: "api_doc_advanced",
        tabTemplate: "wtManagedRouterMySQLAPIAdvanced"
      }
    ]
  }
});