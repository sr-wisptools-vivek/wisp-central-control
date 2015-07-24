Template.wtPowercodeTaxReportTabs.helpers({
  tabData: {
    showTitle: true,
    title: "Powercode Tax Report",
    pages: [
      {
        tabName: "Tax Report",
        tabId: "pc_tax_report",
        tabTemplate: "wtPowercodeTaxReport"
      },{
        tabName: "Monthly Email Report",
        tabId: "pc_tax_email",
        tabTemplate: "wtPowercodeTaxReportEmail"
      }
    ]
  }
});