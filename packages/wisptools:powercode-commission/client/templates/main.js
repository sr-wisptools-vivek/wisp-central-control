Template.wtPowercodeCommissions.helpers({
  tabData: {
    showTitle: true,
    title: "Powercode Commissions",
    pages: [
      {
        tabName: "Commission Reports",
        tabId: "pc_com_reports",
        tabTemplate: "wtPowercodeCommissionReports"
      },{
        tabName: "Configure Users",
        tabId: "pc_com_users",
        tabTemplate: "wtPowercodeCommissionUsers"
      },{
        tabName: "Configure Services",
        tabId: "pc_com_services",
        tabTemplate: "wtPowercodeCommissionServices"
      },{
        tabName: "Configure Commission Groups",
        tabId: "pc_com_types",
        tabTemplate: "wtPowercodeCommissionTypes"
      }
    ]
  }
});