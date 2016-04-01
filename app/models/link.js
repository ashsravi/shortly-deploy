var mongoose = require('../config');
var Schema = mongoose.Schema;
// var db = require('../config');
var crypto = require('crypto');

var linkSchema = new Schema({
  createdAt: Date,
  updatedAt: Date,
  title: { type: String, required: false, unique: true },
  visits: 0,
  code: { type: String, required: false, unique: true },
  url: { type: String, required: true, unique: true },
  baseUrl: { type: String, required: true, unique: true },
});

//shorten function
linkSchema.pre('save', function() {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
});

var Link = mongoose.model('Link', linkSchema);

module.exports = Link;




// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });
