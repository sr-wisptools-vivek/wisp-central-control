Future = Npm.require('fibers/future');

WtBillForwardAPI.config = {
  urlRoot:     Meteor.settings.billforward.urlRoot,
  accessToken: Meteor.settings.billforward.accessToken,
  version: Meteor.settings.billforward.version,
  "requestLogging": true,
  "responseLogging": false,
  "errorLogging": true
}

WtBillForwardAPI.accounts = {
  create:function(new_account){ 

    console.log(new_account);
    var myFuture = new Future();
    Meteor.http.call("POST",WtBillForwardAPI.config.urlRoot+WtBillForwardAPI.config.version+"accounts", { headers: {"Authorization" : "Bearer "+WtBillForwardAPI.config.accessToken, "Content-Type": "application/json"},data: new_account}, 
            function(error,result)
            {
              if(error){console.log(error);}
              //console.log(result);
              console.log(result.statusCode);
              if(result.statusCode == 200)
              {
                // Users.insert(new_account);
                //console.log(result);
                myFuture.return(result);
              }
            });
    return myFuture.wait();
  },
  getAll:function(){
    var myFuture = new Future();
    Meteor.http.call("GET",WtBillForwardAPI.config.urlRoot+WtBillForwardAPI.config.version+"accounts"+"?&records=100", { headers: {"Authorization" : "Bearer "+WtBillForwardAPI.config.accessToken}}, 
            function(error,result)
            {
              if(error){console.log(error);}
              //console.log(result);
              //console.log(result.statusCode);
              if(result.statusCode == 200)
              {
                //console.log(result);
                myFuture.return(result);
              }
            });
    return myFuture.wait();
  },
  getSingleAccount:function(accountId){
    var myFuture = new Future();
    Meteor.http.call("GET",WtBillForwardAPI.config.urlRoot+WtBillForwardAPI.config.version+"accounts"+"/"+accountId, { headers: {"Authorization" : "Bearer "+WtBillForwardAPI.config.accessToken}}, 
            function(error,result)
            {
              if(error){console.log(error);}
              //console.log(result);
              //console.log(result.statusCode);
              if(result.statusCode == 200)
              {
                //console.log(result);
                myFuture.return(result);
              }
            });
    return myFuture.wait();
  },
  
  update:function(new_account, id){
    //console.log(new_account);
    console.log(id);
    var myFuture = new Future();
    Meteor.http.call("PUT",WtBillForwardAPI.config.urlRoot+WtBillForwardAPI.config.version+"accounts", { headers: {"Authorization" : "Bearer "+WtBillForwardAPI.config.accessToken, "Content-Type": "application/json"},
      data: { "@type": "account",
              "id": id,
              "profile": new_account
            }}, 
            function(error,result)
            {
              if(error){console.log(error);}
              //console.log(result);
              console.log(result.statusCode);
              if(result.statusCode == 200)
              {
                myFuture.return(result);
              }
            });
    return myFuture.wait();
  }
}

WtBillForwardAPI.accounts.getAll();

/*
WtBillForwardAPI = {

  config:{
    urlRoot:     Meteor.settings.billforward.urlRoot,
    accessToken: Meteor.settings.billforward.accessToken,
    "requestLogging": true,
    "responseLogging": false,
    "errorLogging": true
    },
  accounts:{
    create:function(new_account){ 

      console.log(new_account);
      var myFuture = new Future();
      Meteor.http.call("GET",WtBillForwardAPI.config.urlRoot, { headers: {"Authorization" : "Bearer "+WtBillForwardAPI.config.accessToken, "Content-Type": "application/json"},data: new_account}, 
              function(error,result)
              {
                if(error){console.log(error);}
                //console.log(result);
                console.log(result.statusCode);
                if(result.statusCode == 200)
                {
                  // Users.insert(new_account);
                  //console.log(result);
                  myFuture.return(result);
                }
              });
              return myFuture.wait();
        },

    update:function(){console.log("update");}
  }

}
*/
