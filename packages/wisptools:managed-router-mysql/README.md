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
and maximum number of results. 

```http
POST /mr/search
```

Sample data
```js
{
  "q":"test",
  "limit":1
}
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
  }
]
```

## Adding Devices
New devices are added by doing a `"post"` to `/mr/add`.  You'll get the newly added devices returned, or an error if
it conflicts with an existing device. 

```http
POST /mr/add
```

Sample data
```js
{
  "serial":"RNV5000511",
  "mac":"00019F1407D2",
  "name":"TEST 123",
  "make":"READYNET",
  "model":"WRT500"
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

Sample data
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

Sample data
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
  "reason": "Not Authorized"
}
```

## Restore Device
Deleted device can be restored by doing a `"post"` to `/mr/undelete`.  You'll get the restored device returned, or an error if
any conflict occurs. 

```http
POST /mr/undelete
```

Sample data
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