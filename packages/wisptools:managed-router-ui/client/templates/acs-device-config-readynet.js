// ReadyNet Devices
acsDeviceConfig['READYNET'] = [];
// Config for WRT500 Router
acsDeviceConfig['READYNET']['WRT500'] = [];
acsDeviceConfig['READYNET']['WRT500'].template = 'wtManagedRouterReadyNet';
acsDeviceConfig['READYNET']['WRT500'].hosts ={
  'table': {
    'count': 'InternetGatewayDevice.LANDevice.1.Hosts.HostNumberOfEntries',
    'items': [
      {
        'name': 'Host Name',
        'acs': 'InternetGatewayDevice.LANDevice.1.Hosts.Host.1.HostName'
      },{
        'name': 'IP Address',
        'acs': 'InternetGatewayDevice.LANDevice.1.Hosts.Host.1.IPAddress'
      },{
        'name': 'MAC Address',
        'acs': 'InternetGatewayDevice.LANDevice.1.Hosts.Host.1.MACAddress'
      },{
        'name': 'Interface',
        'acs': 'InternetGatewayDevice.LANDevice.1.Hosts.Host.1.InterfaceType'
      } 
      /****
       * Signal Strength is a bit harder to do, because you have to match the MAC address in another list.
       * We will have to come back to this value.
       *
       * InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.AssociatedDevice.[X].AssociatedDeviceMACAddress
       * InternetGatewayDevice.LANDevice.1.Hosts.Host.[X].MACAddress
       * InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.AssociatedDevice.[X].X_READYNET_AssociatedDeviceSignalStrength
       ****/
    ]
  }
};
acsDeviceConfig['READYNET']['WRT500'].wifiScan ={
  'bestChannel': 'InternetGatewayDevice.X_READYNET_WIFI.NeighboringWiFiDiagnostic.BestChannel',
  'lastScan': 'InternetGatewayDevice.X_READYNET_WIFI.NeighboringWiFiDiagnostic.CompleteTime ',
  'scanNow': {
    'asc': 'InternetGatewayDevice.X_READYNET_WIFI.NeighboringWiFiDiagnostic.DiagnosticsState',
    'value': 'Requested'
  },
  'table': {
    'count': 'InternetGatewayDevice.X_READYNET_WIFI.NeighboringWiFiDiagnostic.ResultNumberOfEntries',
    'items': [
      {
        'name': 'Channel',
        'acs': 'InternetGatewayDevice.X_READYNET_WIFI.NeighboringWiFiDiagnostic.Result.[X].SignalStrength'
      },{
        'name': 'Signal Strength',
        'acs': 'InternetGatewayDevice.X_READYNET_WIFI.NeighboringWiFiDiagnostic.Result.[X].SignalStrength',
        'append': '%'
      },{
        'name': 'SSID',
        'acs': 'InternetGatewayDevice.X_READYNET_WIFI.NeighboringWiFiDiagnostic.Result.[X].SSID'
      },{
        'name': 'MAC Address',
        'acs': 'InternetGatewayDevice.X_READYNET_WIFI.NeighboringWiFiDiagnostic.Result.[X].BSSID'
      }
    ]
  }
};
acsDeviceConfig['READYNET']['WRT500'].routerConfig ={
  'form': {
    'columns': [
      {
        'title': 'Wireless Settings',
        'items': [
          {
            'name': 'Wireless',
            'acs': 'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.Enable',
            'type': 'bool'
          },{
            'name': 'Channel',
            'acs': 'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.Channel',
            'type': 'dropdown',
            'values': [
              {
                'name': 'Auto',
                'value': '0'
              },{
                'name': '1',
                'value': '1'
              },{
                'name': '6',
                'value': '6'
              },{
                'name': '11',
                'value': '11'
              }
            ]
          },{
            'name': 'SSID',
            'acs': 'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID',
            'type': 'entry'
          },{
            'name': 'Passphrase',
            'acs': 'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.KeyPassphrase',
            'type': 'password'
          }
        ]
      },{
        'title': 'Remote Access Settings',
        'items': [
          {
            'name': 'WAN IP Address',
            'acs': 'InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.ExternalIPAddress',
            'type': 'link',
            'port': 'InternetGatewayDevice.UserInterface.User.1.X_READYNET_WebPort'
          },{
            'name': 'Remote Management',
            'acs': 'InternetGatewayDevice.UserInterface.User.1.RemoteAccessCapable',
            'type': 'bool'
          },{
            'name': 'Remote Management Port',
            'acs': 'InternetGatewayDevice.UserInterface.User.1.X_READYNET_WebPort',
            'type': 'entry'
          },{
            'name': 'Management Username',
            'acs': 'InternetGatewayDevice.UserInterface.User.1.Username',
            'type': 'entry'
          },{
            'name': 'Management Password',
            'acs': 'InternetGatewayDevice.UserInterface.User.1.Password',
            'type': 'password'
          }
        ]
      },{
        'title': 'LAN Settings',
        'items': [
          {
            'name': 'LAN IP',
            'acs': 'InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.1.IPInterfaceIPAddress',
            'type': 'ip', // like entry, but forces IP formatting
            'alsoUpdate': [
              'InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPRouters',
              'InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DNSServers'
            ] // also update these values with the new value when saved
          },{
            'name': 'LAN Subnet Mask',
            'acs': 'InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.1.IPInterfaceSubnetMask',
            'type': 'ip',
            'alsoUpdate': [
              'InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.SubnetMask'
            ]
          },{
            'name': 'DHCP Starting IP',
            'acs': 'InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MinAddress',
            'type': 'ip'
          },{
            'name': 'DHCP Ending IP',
            'acs': 'InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MaxAddress',
            'type': 'ip'
          }
        ]
      }
    ]
  }
};
acsDeviceConfig['READYNET']['WRT500'].info =[
  {
    'name': 'Manufacturer',
    'acs': 'InternetGatewayDevice.DeviceInfo.Manufacturer'
  },{
    'name': 'Model',
    'acs': 'InternetGatewayDevice.DeviceInfo.ModelName'
  },{
    'name': 'LAN MAC Address',
    'acs': 'InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig.1.MACAddress'
  },{
    'name': 'WAN MAC Address',
    'acs': 'InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.MACAddress'
  },{
    'name': 'Serial Number',
    'acs': 'InternetGatewayDevice.DeviceInfo.SerialNumber' 
  },{
    'name': 'Firmware Version',
    'acs': 'InternetGatewayDevice.DeviceInfo.SoftwareVersion'
  }
];

