// Config object for acs device
acsDeviceConfig = [];
// Default for catch all when no match found
acsDeviceConfig['DEFAULT'] = [];
acsDeviceConfig['DEFAULT']['DEFAULT'] = [];
acsDeviceConfig['DEFAULT']['DEFAULT'].template = 'wtManagedRouterDefault';
acsDeviceConfig['DEFAULT']['DEFAULT'].info = [];
acsDeviceConfig['DEFAULT']['DEFAULT'].info [
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
