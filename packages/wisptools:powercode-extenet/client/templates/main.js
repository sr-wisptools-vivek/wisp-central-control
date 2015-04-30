Template.wtPowercodeExteNet.helpers({
  tabData: {
    showTitle: true,
    title: "Powercode ExteNet",
    pages: [
      {
        tabName: "Configure mNET API",
        tabId: "pc_extenet_api",
        tabTemplate: "wtPowercodeExteNetAPI"
      },{
        tabName: "Configure SIM Cards",
        tabId: "pc_extenet_sim",
        tabTemplate: "wtPowercodeSIMCards"
      },{
        tabName: "Configure Services",
        tabId: "pc_extenet_services",
        tabTemplate: "wtPowercodeExteNetServices"
      }
    ]
  }
});