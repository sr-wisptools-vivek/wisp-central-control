Template.wtFriendlyTechInterface.helpers({
  tabData: {
    showTitle: true,
    title: "Managed Router Interface",
    pages: [
      {
        tabName: "Connected Devices",
        tabId: "ft_conn_devices",
        tabTemplate: "wtFriendlyTechConnDevices"
      },{
        tabName: "Wifi Scan",
        tabId: "ft_wifi_scan",
        tabTemplate: "wtFriendlyTechWifiScan"
      },{
        tabName: "Router Config",
        tabId: "ft_router_config",
        tabTemplate: "wtFriendlyTechRouterConfig"
      },{
        tabName: "Info",
        tabId: "ft_info",
        tabTemplate: "wtFriendlyTechInfo"
      }
    ]
  }
});