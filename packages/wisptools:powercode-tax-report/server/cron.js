SyncedCron.add({
  name: 'Email Tax Report',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('on the first day of the month at 3:00 am');
    //return parser.text('every 1 minute');
  },
  job: function() {
    console.log('Running tax report...');

    // Set the start and end date of the report, basically last month.
    var d = new Date();
    var endDate = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-01';
    d.setMonth(d.getMonth() - 1);
    var startDate = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-01';
    var reportDate = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2);


    Meteor.call('wtPowercodeGetTaxReport', startDate, endDate, function (err, res) {

      var converter = Npm.require('json-2-csv');

      var sendCSV = Meteor.bindEnvironment(function (err, csv) {

        var sendToList = WtPowercodeTaxReport.collection.email.find({deleted: {$ne: true}}).fetch();
        var sendToAry = _.map(sendToList, function(item) { return item.email; });
        var to = sendToAry.join();
        console.log(to);

        WtNodemailer.sendMail({
          to: to,
          from: Meteor.settings.wisptools.smtpUser,
          subject: 'PowerCode Tax Report - ' + reportDate,
          text: 'Here is the tax report for: ' + reportDate,
          attachments: [
            {
              filename: 'tax_report_' + reportDate + '.csv',
              contentType: 'text/plain',
              content: csv
            }
          ]
        }, function(error, info){
          if(error){
            return console.log(error);
          }
          console.log('Message sent: ' + info.response);
        });
      }, function (e) {
        throw e;
      });

      converter.json2csv(res, sendCSV);

      console.log('Finished tax report...');
    });

  }
});

SyncedCron.start();