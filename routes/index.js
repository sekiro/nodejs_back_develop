var express = require('express');
var router = express.Router();

var knex = require('knex')({
  dialect: 'mysql',
  connection: {
    host:'192.168.33.10',
    user:'dev_admin',
    password:'dies9029',
    database:'sasami',
    port:'3306'        
  }
});

var Bookshelf = require('bookshelf')(knex);
Bookshelf.plugin('pagination');

var User = Bookshelf.Model.extend({
  tableName: 'users'
});

var Message = Bookshelf.Model.extend({
  tableName: 'messages',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  }
});

router.get('/', (req, res, next) => {
  if (req.session.login == null) {
    res.redirect('/users');
  } else {
    res.redirect('/1');
  }
});

router.get('/:page', (req, res, next) => {
  if (req.session.login == null) {
    res.redirect('/users');
    return;
  }
  var pg = req.params.page;
  pg *= 1;
  if (pg < 1) { pg = 1; }
  new Message().orderBy('created_at', 'DESC')
    .fetchPage({page:pg, pageSize:10, withRelated: ['user']})
    .then((collection) => {
      var data = {
        title: 'miniBoard',
        login: req.session.login,
        collection: collection.toArray(),
        pagination: collection.pagination
      };
      res.render('index', data);
    }).catch((err) => {
      res.status(500).json({error: true, data: {message: err.message}});
    });
});

router.post('/', (req, res, next) => {
  var rec = {
    message: req.body.msg,
    user_id: req.session.login.id
  };
  console.log(rec);

  new Message(rec).save().then((model) => {
    res.redirect('/');
  });
});

module.exports = router;
