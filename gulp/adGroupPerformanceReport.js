var
  _ = require('lodash'),
  async = require('async'),
  gulp = require('gulp'),
  parseString = require('xml2js').parseString,
  pd = require('pretty-data').pd,
  soap = require('soap');

gulp.task(
  'adWords:adGroupPerformanceReport',
  'Google AdWords reports',
  function(cb) {
    var argv = require('yargs')
      .default(
        'clientCustomerId',
        process.env.ADWORDS_CLIENT_CUSTOMER_ID,
        'clientCustomerId of account'
      )
      .argv;

    var AdWords = require('..');
    var report = new AdWords.AdGroupPerformanceReport();

    report.getReportFields(function(err, results) {
      if (err) return cb(err);

      var fieldNames = results.rval.map(function(field) {
        return field.get('fieldName');
      });

      fieldNames = [
        'CampaignId',
        'Impressions',
        'Interactions',
        'Clicks',
        'Cost'
      ]

      var options = {
        clientCustomerId: argv.clientCustomerId,
        // fieldNames: fieldNames,
        predicates: [
          {
            field: 'CampaignStatus',
            operator: 'IN',
            values: [
              {'#text': 'ENABLED'},
              {'#text': 'PAUSED'}
            ]
          }
        ]
      };

      report.getReport(options, function(err, incoming, response) {
        if (err) return cb(err);
        console.log(pd.xml(response));

        // parseString(response, function (err, result) {
        //   console.log(result.report.table[0].row[0]['$']);
        //   cb();
        // });
        // cb();
      });
    });
  }
);
