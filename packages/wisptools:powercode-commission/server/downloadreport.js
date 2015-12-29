Meteor.methods({
  downloadReport: function(reportdate) {
    console.log(reportdate);

    var given = reportdate.split(" ");
    switch (given[1])
    {
      case 'Jan' :
        given[1] = "01";
        break;
      case 'Feb' :
        given[1] = "02";
        break;
      case 'Mar' :
        given[1] = "03";
        break;
      case 'Apr' :
        given[1] = "04";
        break;
      case 'May' :
        given[1] = "05";
        break;
      case 'Jun' :
        given[1] = "06";
        break;
      case 'Jul' :
        given[1] = "07";
        break;
      case 'Aug' :
        given[1] = "08";
        break;
      case 'Sep' :
        given[1] = "09";
        break;
      case 'Oct' :
        given[1] = "10";
        break;
      case 'Nov' :
        given[1] = "11";
        break;
      case 'Dec' :
        given[1] = "12";
        break;
    }
    given[2] = "01";
    given = given.join("-");
    var end = given.split("-");
    end[2] = "31";
    end = end.join("-");
    var result = WtPowercodeCommission.collection.report.find({"Date": {$gte: given, $lt: end}, "isPaidUp": "Yes"}).fetch();
    var converter = Npm.require('json-2-csv');
    var json2csvCallback = function(err, csv) {
      if (err)
        throw err;
      
      var blob = new Blob([csv],
              {type: "text/csv;charset=utf-8"});
      saveAs(blob, "yourfile.csv");
      //    console.log(csv);
      // console.log("hello");

    };

    converter.json2csv(result, json2csvCallback);


  }
});

