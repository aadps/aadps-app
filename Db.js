var Store = require('react-native-store');

class Db{
  constructor() {
    this.user=Store.model('user');
    this.college=Store.model('college');
  }

  test() {
    this.user.add({test: 'test'});
  }
}

module.exports=Db;
