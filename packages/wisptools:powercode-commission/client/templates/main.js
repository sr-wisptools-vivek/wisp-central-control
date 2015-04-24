Template.wtPowercodeCommissions.helpers({
  tabData: {
    showTitle: true,
    title: "Powercode Commissions",
    pages: [
      {
        name: "Commission Reports",
        id: "pc_com_reports",
        template: "wtPowercodeCommissionReports"
      },{
        name: "Configure Users",
        id: "pc_com_users",
        template: "wtPowercodeCommissionUsers"
      },{
        name: "Configure Services",
        id: "pc_com_services",
        template: "wtPowercodeCommissionServices"
      },{
        name: "Configure Commission Types",
        id: "pc_com_types",
        template: "wtPowercodeCommissionTypes"
      }
    ]
  }
});