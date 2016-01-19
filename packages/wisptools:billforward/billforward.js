// Write your package code here!
// WtBillForward = {};

// Add the database connection
if (Meteor.isServer) {

  config = {
					  urlRoot:     Meteor.settings.billforward.urlRoot,
					  accessToken: Meteor.settings.billforward.accessToken,
					  "requestLogging": true,
					  "responseLogging": false,
					  "errorLogging": true
					};
						  
  Meteor.methods({
  
  "createBillForwardAcount": function(new_account){
      //console.log('Test 4');
      var response = WtBillForwardAPI.accounts.create(new_account);
      var account_details = response.data.results[0].profile;
      var accId = response.data.results[0].profile.accountID;
      var res = WtBillForwardAccounts.collection.accounts.insert({"accId":accId,"details":account_details});
      if (res) {
       return response;
      } else {
        return "failed";
      }
    },
  "updateBillForwardAcount": function(new_account, id){
      console.log('Test 5');
      console.log(id);
      var response = WtBillForwardAPI.accounts.update(new_account,id);
      var new_data = response.data.results[0].profile;
      //var account_data = WtBillForwardAccounts.collection.accounts.findOne({'details.accountID':id});
      //var mongo_id = account_data._id;
      console.log(new_data);
      //var res = WtBillForwardAccounts.collection.accounts.update({'_id':mongo_id},{'$set':{details:new_data}});
      var res = WtBillForwardAccounts.collection.accounts.update({'accId':id},{'$set':{details:new_data}});
      if (res) {
       return res;
      } else {
        return "failed";
      }
      //var account_details = response.data.results[0].profile;
      //var res = WtBillForwardAccounts.collection.accounts.insert({details:account_details});
    },
  "getBillForwardAcounts": function(){
  
      var account_details = WtBillForwardAPI.accounts.getAll();
      return account_details;
    },
  "getSingleBillForwardAcount1": function(accountId){
  
      var account_details = WtBillForwardAPI.accounts.getSingleAccount(accountId);
      return account_details;
    },
  "getSingleBillForwardAcount": function(accountId){
      accountId =String(accountId);
      //console.log(accountId);
      //console.log(typeof(accountId));
      //console.log("test");
      var single_account_details = WtBillForwardAccounts.collection.accounts.findOne({'details.accountID':accountId});
      //console.log(single_account_details);
      return single_account_details;

    }
  });						  

}

