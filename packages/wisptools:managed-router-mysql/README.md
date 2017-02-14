## RESTful API
The Managed Router MySQL package includes support for RESTful API calls.

## Authentication
Before other requests will be accepted, you'll need an authentication token.  To get a token you'll need to `"post"` a json object to `/users/login`, containing your login username and password.

```http
POST /users/login
```

Sample data

```js
{
  "username":"USERNAME",
  "password":"PASSWORD"
}
```

Sample result
```js
{
  "id": "HS7fELJQG4tLyx7kc",
  "token": "SF4OCULoTD2J1AjDJBfld9xQr-be7pvCsxJcJMIjaBA",
  "tokenExpires": "2016-03-31T18:52:55.490Z"
}
```

### Example login code with JQuery

```js
// Getting an oauth token
$.ajax({
  method: "post",
  url: "https://[domain]/users/login",
  data: JSON.stringify({"username":"user","password":"pass"}),
  contentType: "application/json",
  success: function (data) {
    console.log(data.token);
  }
});
```

## Using the Token
After you have received a valid token, include it in the header when making API calls.

```http
Authorization: Bearer <token>
```

### Example API call using JQuery and token in header

```js
// Search for device
$.ajax({
  method: "post",
  url: "https://[domain]/mr/search",
  data: JSON.stringify({"q":"abc","limit":5}),
  contentType: "application/json",
  headers: { Authorization: "Bearer " + token },
  success: function (data) {
    console.log(data);
  }
});
```

## Searching for Devices
There are three ways you can search for devices.  They all work with a `"post"` to `/mr/search`. 
Searches try matching on the Name, Serial Number and MAC Address of the device. 

### Method One
If you make a search request, but supply no data, it will return the most recent 20 devices.

```http
POST /mr/search
```

Sample result
```js
[
  {
    "id": 1267774,
    "domain": "test",
    "name": "TEST 123",
    "serial": "RNV5000512",
    "mac": "00019F1407D2",
    "make": "READYNET",
    "model": "WRT500",
    "url": "http://159.203.192.31/mr/?ID=1267774&TOKEN=XXX"
  },
  {
    "id": 1267772,
    "domain": "test",
    "name": "Jerry",
    "serial": "RNV5018859",
    "mac": "00019F153665",
    "make": "READYNET",
    "model": "WRT500",
    "url": "http://159.203.192.31/mr/?ID=1267772&TOKEN=XXX"
  },
  {
    "id": 1267770,
    "domain": "test",
    "name": "TEST",
    "serial": "RNV5000511",
    "mac": "00019F1407DD",
    "make": "READYNET",
    "model": "WRT500",
    "url": "http://159.203.192.31/mr/?ID=1267770&TOKEN=XXX"
  }
]
```

### Method Two
Passing an array with a single string will do a search using the string, returning a maximum of 20 devices.

```http
POST /mr/search
```

Sample data
```js
["RNV50005"]
```

Sample result
```js
[
  {
    "id": 1267774,
    "domain": "test",
    "name": "TEST 123",
    "serial": "RNV5000512",
    "mac": "00019F1407D2",
    "make": "READYNET",
    "model": "WRT500",
    "url": "http://159.203.192.31/mr/?ID=1267774&TOKEN=XXX"
  },
  {
    "id": 1267770,
    "domain": "test",
    "name": "TEST",
    "serial": "RNV5000511",
    "mac": "00019F1407DD",
    "make": "READYNET",
    "model": "WRT500",
    "url": "http://159.203.192.31/mr/?ID=1267770&TOKEN=XXX"
  }
]
```


### Method Three
This is the most detailed way to do a search.  It requires an JSON object with pramaters that specify the search query
and maximum number of results.  It is also allows for a search of the Reserved Router database.  Partial searches of Reserved Router database will return matches found up to the limit.

```http
POST /mr/search
```

Sample post data
```js
{
  "q":"RNV5000512",
  "limit":1,
  "type":"reservation"
}
```

Sample result
```js
[
  {
    "serial": "RNV5000512"
  }
]
```

## Adding Devices
New devices are added by doing a `"post"` to `/mr/add`.  You'll get the newly added devices returned, or an error if
it conflicts with an existing device. 

```http
POST /mr/add
```

Sample post data
```js
{
  "serial":"RNV5000511",
  "mac":"00019F1407D2",
  "name":"TEST 123"
}
```

Sample result
```js
[
  {
    "id": 1267774,
    "domain": "test",
    "name": "TEST 123",
    "serial": "RNV5000511",
    "mac": "00019F1407D2",
    "make": "READYNET",
    "model": "WRT500",
    "url": "http://159.203.192.31/mr/?ID=1267774&TOKEN=88b0930699d3ef20659e013a906fe36a"
  }
]
```

Sample error
```js
{
  "error": "dup",
  "reason": "Duplicate Serial Number",
  "details": "RNV5000511"
}
```

## Updating Device Name and MAC
Device MAC and Name can be updated by doing a `"post"` to `/mr/update`.  You'll get the updated device returned, or an error if
it conflicts with an existing device.


```http
POST /mr/update
```

Sample data
```js
{
    "id":"1267785",
    "serial":"RNV5019236",
    "new": { "mac": "00019F153C50"}
}
```

Sample post data
```js
{
    "id":"1267785",
    "serial":"RNV5019236",
    "new": { "name": "VOIP"}
}
```

Sample result
```js
[
  {
    "id": 1267785,
    "domain": "dev",
    "name": "VOIP",
    "serial": "RNV5019236",
    "mac": "00019F153C50",
    "make": "READYNET",
    "model": "WRT500",
    "url": "http://159.203.192.31/mr/?ID=1267785&TOKEN=de62c38967973ccc5545f3e45ac1bc0b"
  }
]
```

Sample error
```js
{
  "error": "dup",
  "reason": "Duplicate MAC Address",
  "details": "00019F153C50"
}
```

## Delete Device
Device can be deleted by doing a `"post"` to `/mr/delete`.  You'll get the deleted device returned, or an error if
any conflict occurs. 

```http
POST /mr/delete
```

Sample post data
```js
{
    "id":"1267785",
    "serial":"RNV5019236"
}
```

Sample result
```js
[
  {
    "id": 1267785,
    "status": "Deleted"
  }
]
```

Sample error
```js
{
  "error": "denied",
  "reason": "Not Authorized"
}
```

## Restore Device
Deleted device can be restored by doing a `"post"` to `/mr/undelete`.  You'll get the restored device returned, or an error if
any conflict occurs. 

```http
POST /mr/undelete
```

Sample post data
```js
{
    "id":"1267785",
    "serial":"RNV5019236"
}
```

Sample result
```js
[
  {
    "id": 1267785,
    "domain": "dev",
    "name": "VOIP",
    "serial": "RNV5019236",
    "mac": "00019F153C50",
    "make": "READYNET",
    "model": "WRT500",
    "url": "http://159.203.192.31/mr/?ID=1267785&TOKEN=de62c38967973ccc5545f3e45ac1bc0b"
  }
]
```

Sample error
```js
{
  "error": "denied",
  "reason": "Domain Error"
}
```

## Reserve Serial Number
A serial number reservation is a method for a privilaged user to set aside serial numbers for specific `domains`.  Any serial number can be reserved, not just currently supported RN Control make/models.  Any domain can be added, it does not have to be in current use.

Users with `admin` or `reseller` previlages can reserve a serial number, by doing a `"post"` to `/mr/reserve`.  The `result` of `success` means the serial number reservation was properly added or updated in the database, anything else is a failure.  You'll get a `result` on each serial number passed in.

```http
POST /mr/reserve
```

Sample post data
```js
[
  {
    "serial":"RNV5000520",
    "domain":"test"
  },
  {
    "serial":"RNV6000521",
    "domain":"cool-isp"
  },
  {
    "serial":"RNV6000522",
    "domain":"cool-isp",
    "extra":"value"
  },
  {
    "serial":"RNV6000523",
    "domain":""
  },
  {
    "serial":"",
    "domain":"cool-isp"
  },
  {
    "serial":"123"
  },
  {
    "domain":"123"
  },
  {},
  {
   "dummy":"i am smart"
  }
]
```

Sample result
```js
[
  {
    "serial": "RNV5000520",
    "result": "success"
  },
  {
    "serial": "RNV6000521",
    "result": "success"
  },
  {
    "serial": "RNV6000522",
    "result": "success"
  },
  {
    "serial": "RNV6000523",
    "result": "domain cannot be blank"
  },
  {
    "serial": "",
    "result": "serial cannot be blank"
  },
  {
    "serial": "123",
    "result": "domain value missing"
  },
  {
    "result": "serial value missing"
  },
  {
    "result": "domain value missing"
  },
  {
    "result": "domain value missing"
  }
]
```
# Getting and Setting Data Directly on the ACS

The following end points are used for a more direct way of talking to the ACS.  These end points are authenticated using the same login and token used above.  Even though you are getting access into the ACS, many things have been simplified for you.  For example, the list of `hosts` you get when using `/mr/acs/device/get` is put into a single easy to use list, rather than given to you as it is in the ACS, spread out into five different data trees.  You can thank us later.

## Get Data on ACS

This gives you the most recent data, on a device, from the ACS. The data returned will depend on the make and model of the equipment.  For instance, some routers don't have VoIP port, so a `get` will not return any VoIP related items.

Some values have an `item_id` which is used when updating the value using the `/mr/acs/device/set` call below.

```http
POST /mr/acs/device/get
```

Sample post data
```js
{
    "id":"1267785"
}
```

Sample result
```js
{  
  "last_check_in":"1/2/2017 2:50 PM (10 days and 5 hours ago)",
  "uptime":"8 days and 10 hours",
  "status":"Offline",
  "connected_hosts":[  
    {  
      "host_name":"Unknown",
      "ip_address":"192.168.0.21",
      "mac_address":"00:10:75:2B:1D:85",
      "interface":"Ethernet",
      "signal_strength":"N/A"
    },
    {  
      "host_name":"hp-laptop",
      "ip_address":"192.168.0.176",
      "mac_address":"00:C2:C6:BB:51:A7",
      "interface":"802.11",
      "signal_strength":"-57db"
    },
    {  
      "host_name":"AppleWatch",
      "ip_address":"192.168.0.145",
      "mac_address":"08:66:98:55:53:19",
      "interface":"802.11",
      "signal_strength":"-46db"
    }
  ],
  "main_config":[  
    {  
      "item_id":"64",
      "name":"Wireless",
      "type":"Enabled/Disabled",
      "value":"true"
    },
    {  
      "item_id":"66",
      "name":"2.4 Ghz Channel",
      "type":"Drop Down",
      "value":"1"
    },
    {  
      "item_id":"67",
      "name":"2.4 Ghz SSID",
      "type":"Text Entry",
      "value":"LAMBERT"
    },
    .
    .
    .

  ],
  "info":[  
    {  
      "name":"Manufacturer",
      "type":"Read Only",
      "value":"READYNET"
    },
    {  
      "name":"Model",
      "type":"Read Only",
      "value":"AC1200MS"
    },
    {  
      "name":"Firmware Version",
      "type":"Read Only",
      "value":"V3.11(201611232024)"
    },
    .
    .
    .

  ],
  .
  .
  .

  "routerlimits":[  
    {  
      "item_id":"111",
      "name":"Router Limits System",
      "type":"Enabled/Disabled",
      "value":"1"
    },
    {  
      "name":"Current Status",
      "type":"Read Only",
      "value":"online"
    },
    {  
      "name":"Current Version",
      "type":"Read Only",
      "value":"2.9-release-readynet-20161122052748"
    },
    {  
      "name":"Pairing Code",
      "type":"Read Only",
      "value":"1234"
    }
  ]
}
```

Sample error
```js
{
  "error": "denied",
  "reason": "Domain Error"
}
```
## Set Data on the ACS

Values can be set for items, returned in the `get` call, that have an `item_id`.  It's important to refer to the `item_id` returned in the `get`, as they same type of data might have a different `item_id` on a different make/model.  For example, the 2.4 GHz SSID is not always `item_id=67` on every device.

```http
POST /mr/acs/device/set
```

This will update the Channel and SSID on the sample device. For values that are `true` or `false, the following are all accepted as true: "Enabled", true, "true" and 1.  Everything else is sent to the ACS as false.

Sample post data
```js
{
  id:1267785,
  values:[
    {
      item_id:66,
      value:6
    },
    {
      item_id:67,
      value:'TEST'
    }
  ]
}
```

I know this reply is quite bare, but there isn't much more to give you.  It does let you know that the ACS has accepted the change, placing it into the update queue.  You can do a follow up `get` to verify the actual data.

Sample result
```js
{
  acs_reply: "accepted"
}
```

Sample error
```js
{
  "error": "denied",
  "reason": "Domain Error"
}
```
## Reboot a Device

You can tell a device to reboot using the following end point.

```http
POST /mr/acs/device/reboot
```

Sample post data
```js
{
    "id":"1267785"
}
```
Sample result
```js
{
  acs_reply: "accepted"
}
```

Sample error
```js
{
  "error": "denied",
  "reason": "Domain Error"
}
```

## Refresh Data on Device

Refreshing will tell the ACS to reach out to a device and request that it does a check in.  If the device is offline, this command will likely error out.

```http
POST /mr/acs/device/refresh
```

Sample post data
```js
{
    "id":"1267785"
}
```
Sample result
```js
{
  acs_reply: "accepted"
}
```

Sample error
```js
{
  "error": "denied",
  "reason": "Domain Error"
}
```
