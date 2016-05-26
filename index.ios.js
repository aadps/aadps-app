'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  NavigatorIOS,
  TabBarIOS,
  PixelRatio,
  Alert,
} from 'react-native';

var Db = require('./Db');
var myDb = new Db();
var User = require('./User');
var Nav = require('./Nav');
var Pick = require('./Pick');
var News = require('./News');
var Chan = require('./Chan');
var Dimensions = require('Dimensions');
var Linking = require('Linking');
var _navigator = null;

var _main, _nav;

const viewProp = [{
  color: '#ffc107',
  action: [{name: '排序',
  function: function(){
    order++;
    myDb.getFav().then(dbFav => {
      if(dbFav){
        myDb.getCardData(dbFav.fav, order%3).then(result => {
          if(result)cardData = result;
          else cardData = [];
          _main.setState({popup: 0});
        });
      }
    });
  }
}],
},{
  color: '#8bc34a',
  action: [{name: '排序',
  function: function(){
    order++;
    myDb.filter(filterFav).then(result => {
      _main.setState({popup: 0});
      setTimeout(function(){_main.refs.myPick.set(buildPick(result))}, 200);
    });
  }
}, {name: '筛选',
function: function(){
  _nav.push({
    component: Pick,
    passProps: {data:filterData, picked:filterFav, isPerm:false, callback: function(){

      myDb.filter(filterFav).then(result => {
        _main.refs.myPick.set(buildPick(result));
      });
    }},
    title: '院校筛选',
    tintColor: '#8bc34a',
  });
  _main.setState({popup: 0});
}
}],
},{
  color: '#f44336',
  action: [],
},{
  color: '#2196f3',
  action: [],
},{
  color: '#009688',
  action: [],
}];
var lists = [
  [{name: '拼音A', ids: [3675, 1791, 933, 3644]},
  {name: '拼音B', ids: [3580, 2242, 2233, 1977, 1617, 3685, 2198, 232, 1718, 1801,
  1737, 1641, 1647, 1560, 2227]},
  {name: '拼音D', ids: [1407, 2116, 3679, 3681, 1724, 3661, 3567, 1404, 1739]},
  {name: '拼音E', ids: [3569, 3689, 3687]},
  {name: '拼音F', ids: [1563, 1745, 3669, 1606, 3663, 3563]},
  {name: '拼音G', ids: [928, 3575]},
  {name: '拼音H', ids: [937, 1988, 2118, 2130, 1733, 2126]},
  {name: '拼音J', ids: [3531, 3533, 3541, 1554, 3537, 3539, 3535, 3547, 3543, 3549]},
  {name: '拼音K', ids: [1985, 925, 3559, 3683, 930, 3561, 2192, 2194, 3673, 2238,
  2110, 3577]},
  {name: '拼音L', ids: [1574, 2240, 1714, 3571, 947, 3636]},
  {name: '拼音M', ids: [1397, 2202, 1756, 3677, 3565, 2244, 3665, 943, 3642, 1806,
  3640]},
  {name: '拼音N', ids: [1760, 1610, 3648, 945]},
  {name: '拼音O', ids: [2229]},
  {name: '拼音P', ids: [1750, 1762, 3638, 1387]},
  {name: '拼音Q', ids: [1593, 1768]},
  {name: '拼音S', ids: [3582, 3573, 1576, 2246, 3650, 2196, 2206, 1399, 1796]},
  {name: '拼音T', ids: [3671, 1612, 3667]},
  {name: '拼音W', ids: [2112, 1981, 1651, 1789, 952, 205, 2132, 3652]},
  {name: '拼音X', ids: [1557, 2248, 1770]},
  {name: '拼音Y', ids: [1391, 241, 3646]},
  {name: '拼音Z', ids: [177, 3634, 1131]}],
  [{name: '字母A', ids: [3675, 3665, 1791]},
  {name: '字母B', ids: [3580, 2233, 2198, 1641, 1737, 1977, 1647, 1560, 2227, 2242]},
  {name: '字母C', ids: [3531, 3533, 1554, 3535, 3537, 3539, 3541, 3543,
  3547, 3549, 1985, 925, 3559, 177, 2110, 2192, 2194, 3673, 2238, 928, 3561,
  930]},
  {name: '字母D', ids: [1407, 2116, 3667, 3679, 3681, 1404]},
  {name: '字母E', ids: [933]},
  {name: '字母F', ids: [1745, 3563]},
  {name: '字母G', ids: [1768, 1593, 3634, 1131, 3575]},
  {name: '字母H', ids: [2130, 937, 2118, 1988, 2246]},
  {name: '字母I', ids: [241, 3646, 3644]},
  {name: '字母K', ids: [3683, 3577]},
  {name: '字母L', ids: [1714]},
  {name: '字母M', ids: [2202, 1756, 3677, 1397, 3565, 3648, 943, 3642, 1806, 3640,
  2244]},
  {name: '字母N', ids: [945, 1617, 3685, 3567, 1557, 1576]},
  {name: '字母O', ids: [2229, 3569, 3689, 3687]},
  {name: '字母P', ids: [232, 1718, 1750, 1762, 1801, 1387, 3638]},
  {name: '字母R', ids: [3571, 1574, 2240, 947, 3636]},
  {name: '字母S', ids: [2206, 2248, 2196, 1610, 1760, 1399, 3650, 1796, 1770]},
  {name: '字母T', ids: [3661, 1724, 3582, 1612, 1739, 3671]},
  {name: '字母V', ids: [1563, 2112, 3669, 1606, 3663]},
  {name: '字母W', ids: [205, 1733, 2126, 3573, 1981, 2132, 1651, 1789, 952, 3652]},
  {name: '字母Y', ids: [1391]}],
  [{name: 'A指数90+', ids: [1399, 937, 1387, 928, 1391, 1397, 1554, 1801, 1981,
  1407, 2118, 177]},
  {name: 'A指数85+', ids: [232, 1560, 1789, 2110, 1404, 1563, 1796, 930, 1574,
  1985, 2233, 1557, 1791, 2196, 3531]},
  {name: 'A指数80+', ids: [925, 1806, 2112, 933, 2227, 3575, 943, 2132, 2192,
  2194, 2198, 2202, 3537, 1606, 1610, 945, 1576, 1612, 1617, 1988, 2229, 2242]},
  {name: 'A指数75+', ids: [1641, 2126, 2238, 2244, 1131, 1977, 2130, 3573, 947,
  2240, 3543, 3580, 205, 2248, 3547, 241, 1651, 2116, 3533, 3577]},
  {name: 'A指数70+', ids: [2206, 3535, 3559, 952, 1737, 1718, 2246, 3582, 1593,
  1647, 3638]},
  {name: 'A指数60+', ids: [1739, 3571, 1733, 1745, 3569, 1714, 3565, 3640, 3567,
  1750, 1770, 3563, 1756, 1768]},
  {name: 'A指数50+', ids: [3636, 3652, 1762, 3549, 1724, 3634, 3661, 3646, 3650,
  1760, 3677, 3541, 3642, 3667, 3561, 3663, 3673]},
  {name: 'A指数49-', ids: [3644, 3648, 3685, 3665, 3679, 3669, 3671, 3675, 3681,
  3683, 3687, 3539, 3689]}]
  ];
var order = 0;
const nullProfile = ['', '点此注册登录', ''];

var cardData = [];

const filterData = [{name: '地理位置', data: [{id: 1, name: '新英格兰'},
  {id: 2, name: '五大湖'},
  {id: 3, name: '老南方'},
  {id: 4, name: '中部山区'},
  {id: 5, name: '西北'},
  {id: 6, name: '加州'}]},
  {name: '申请难度', data: [{id: 11, name: '极难'},
  {id: 12, name: '难'},
  {id: 13, name: '尚可'},
  {id: 14, name: '保底'}]},
  {name: '院校规模', data: [{id: 21, name: '迷你'},
  {id: 22, name: '中等'},
  {id: 23, name: '大型'},
  {id: 24, name: '超大型'}]}];
var pickData = [];

var filterFav = [1, 2, 3, 4, 5, 6, 11, 12, 13, 14, 21, 22, 23, 24];
var fav = [];
var view = 0;

function buildPick(filterResult) {
  var list = lists[order%3];
  if(!filterResult)return [];
  var cnames={};
  for(var i = 0; i < filterResult.length; i++){
    cnames[filterResult[i].id]=filterResult[i].cname;
  }
  for(var i = 0; i < list.length; i++){
    var data=[];
    for(var j = 0; j < list[i].ids.length; j++){
      if(cnames[list[i].ids[j]])data.push({id: list[i].ids[j], name: cnames[list[i].ids[j]]});
    }
    list[i].data=data;
  }
  return list;
}

function syncFav() {
  myDb.getUser().then(user => {
    if(user)myDb.getFav().then(dbFav => {
      if(dbFav)fetch('https://aadps.net/wp-content/themes/aadps/ajax.php', {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: 'syncfav=&user=' + user.user + '&passwd=' + user.passwd
          + '&fav=' + JSON.stringify(dbFav.fav) + '&time=' + dbFav.time
      })
      .then((response) => response.json())
      .then((result) => {
        if(result.time > dbFav.time){
          fav = JSON.parse(result.fav);
          myDb.setFav(fav, result.time);
        }
      });
      else fetch('https://aadps.net/wp-content/themes/aadps/ajax.php', {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: 'syncfav=&user=' + user.user + '&passwd=' + user.passwd
          + '&fav=[]&time=0'
      })
      .then((response) => response.json())
      .then((result) => {
        fav = JSON.parse(result.fav);
        myDb.setFav(fav, result.time);
      });
    });
  });
}

function regChat(){
  myDb.getUser().then(user => {
    if(user)myDb.getPushChan().then(chan => {
      if(chan){
        fetch('https://aadps.net/wp-content/themes/aadps/ajax.php', {
          method: 'POST',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: 'regchat=&type=ios&user='+user.user+'&passwd='+user.passwd+'&chan='+chan
        }).catch(function(e) {});
      }
    });
  });
}

class aadps extends React.Component{

  componentDidMount(){
    _nav = this.refs.nav;
  }

  render() {
    if(this.props.view != undefined)view = this.props.view;
    return (
      <NavigatorIOS
      style={styles.container}
      ref="nav"
      initialRoute={{
        component: Main,
        title: 'AADPS',
        rightButtonIcon: require('./image/ic_add_white_24dp.png'),
        tintColor: '#777',
        onRightButtonPress: ()=>{_main.setState({popup: 1})}}} />
    );
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 0,
      profile: nullProfile,
      color: viewProp[0].color,
      popup: 0,
    };

    _main = this;

    syncFav();
    myDb.getFav().then(dbFav => {
      if(dbFav){
        myDb.getCardData(dbFav.fav, order%3).then(result => {
          if(result)cardData = result;
          else cardData = [];
          this.forceUpdate();
        });
      }
    });

  }

  componentDidMount() {
    this._intId = setInterval(() => {this.fetchView()}, 3000);
  }

  componentWillUnmount() {
    clearInterval(this._intId);
  }

  fetchView() {
    myDb.getPushView().then(view => {
      if(view){
        this.setState({view: view});
      }
    });
  }

  logout() {
    myDb.erase().then(() => {
      this.forceUpdate();
    });
  }

  isLoggedIn() {
    return this.state.profile[2];
  }

  _renderContent(view) {
    var mainView=<View />, buttons=[];
    switch (view) {
      case 0: mainView=<Nav db={myDb} data={cardData} />; break;
      case 1: mainView=<Pick db={myDb} data={lists[order%3]} picked={fav} isPerm={true} ref="myPick" />; break;
      case 2: mainView=<News />; break;
      case 3: mainView=<Chan db={myDb}  nav = {_nav}/>; break;
      case 4: mainView=(
        <ScrollView style={styles.menu}>

        <View style={styles.menuSpace}></View>
        <TouchableHighlight onPress={()=>{this.isLoggedIn()?Alert.alert(
            '确定注销当前帐号？',
            '',
            [
              {text: 'OK', onPress: () => {this.logout()}},
              {text: '取消', onPress: () => {}},
            ]
          ):_nav.push({
          component: User,
          passProps: {nav: _nav, db: myDb, syncFav: syncFav},
          title: '登录',
          tintColor: viewProp[4].color});}}>
        <View style={styles.menuHead}>
        <Image style={styles.menuAvatar} resizeMode={Image.resizeMode.cover} source={this.isLoggedIn()?{uri: this.state.profile[0]}:require('./image/nullavatar.gif')} />
        <Text style={styles.menuName}>{this.state.profile[1]}</Text>
        <Text style={styles.menuCell}>{this.state.profile[2]}</Text>
        </View>
        </TouchableHighlight>

        <View style={styles.menuSpace}></View>
        <View style={styles.menuGroup}>
        <TouchableHighlight onPress={()=>{Linking.openURL('tel:4000223774')}}><View style={styles.menuItem}>
        <Image style={[styles.menuIcon, {tintColor: viewProp[4].color}]}
        resizeMode={Image.resizeMode.stretch}
        source={require('./image/ic_call_white_24dp.png')} />
        <Text style={styles.menuText}>电话咨询</Text>
        </View></TouchableHighlight>

        <View style={styles.menuLine}></View>

        <TouchableHighlight onPress={()=>{Linking.openURL('http://aadps.net/about')}}><View style={styles.menuItem}>
        <Image style={[styles.menuIcon, {tintColor: viewProp[4].color}]}
        resizeMode={Image.resizeMode.stretch}
        source={require('./image/ic_help_white_24dp.png')} />
        <Text style={styles.menuText}>关于AADPS</Text>
        </View></TouchableHighlight>
        </View>

        <View style={styles.menuSpaceF}></View>

        </ScrollView>
      );
      defualt: break;
    }
    for(var i=0; this.state.popup && i<viewProp[view].action.length; i++ )
      buttons.push(<TouchableHighlight onPress={viewProp[view].action[i].function} key={i}>
            <View style={{backgroundColor: '#fff', padding: 12}}>
            <Text style={{fontSize: 16}}>{viewProp[view].action[i].name}</Text>
            </View>
            </TouchableHighlight>);
    return (
      <View style={{flex: 1}}>
      {mainView}
      <TouchableWithoutFeedback onPress={()=>{this.setState({popup:0})}}>
      <View style={{backgroundColor: '#333', opacity: 0.5, height: this.state.popup&&viewProp[this.state.view].action.length?Dimensions.get('window').height:0, width: Dimensions.get('window').width, top: 0, left: 0, position: 'absolute'}} />
      </TouchableWithoutFeedback>
      <View style={{shadowColor: '#000', shadowOffset: {height: 1, width: 3}, shadowRadius: 5, shadowOpacity: 0.8, borderRadius: 5, padding: this.state.popup&&viewProp[this.state.view].action.length?5:0, top: 66, opacity: 0.8, right: 6, width: 120, position: 'absolute'}}>
      {buttons}
      </View>
      </View>
    );
  }

  render() {

    myDb.getUser().then(user => {
      if(user && this.state.profile[2] != user.profile[2])this.setState({profile: user.profile});
      else if(!user && this.isLoggedIn())this.setState({profile: nullProfile});
    });

    return (
      <TabBarIOS tintColor={this.state.color}>
        <TabBarIOS.Item
          icon={require('./image/ic_star_border_white_24dp.png')}
          selectedIcon={require('./image/ic_star_white_24dp.png')}
          title="大学"
          selected={this.state.view === 0}
          onPress={() => {
            this.setState({view:0, color: viewProp[0].color,  popup: 0,});
            myDb.getFav().then(dbFav => {
              if(dbFav)fav = dbFav.fav;
              else fav = [];
              myDb.getCardData(fav, order%3).then(result => {
                if(result)cardData = result;
                else cardData = [];
                this.forceUpdate();
              });
            })
          }}>
          {this._renderContent(0)}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={require('./image/ic_search_white_24dp.png')}
          title="选校"
          selected={this.state.view === 1}
          onPress={() => {
            this.setState({view:1, color: viewProp[1].color, popup: 0,});
            syncFav();
            myDb.getFav().then(dbFav => {
              if(dbFav)fav = dbFav.fav;
              else fav = [];
              myDb.filter(filterFav).then(result => {
                _main.refs.myPick.setState({data: buildPick(result)});
                this.forceUpdate();
              });
            });
          }}>
          {this._renderContent(1)}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={require('./image/ic_description_white_24dp.png')}
          title="资讯"
          selected={this.state.view === 2}
          onPress={() => {
            this.setState({
              view: 2, color: viewProp[2].color, popup: 0,
            });
          }}>
          {this._renderContent(2)}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={require('./image/ic_chat_white_24dp.png')}
          title="聊天"
          selected={this.state.view === 3}
          onPress={() => {
            regChat();
            this.setState({
              view: 3, color: viewProp[3].color, popup: 0,
            });
          }}>
          {this._renderContent(3)}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={require('./image/ic_person_outline_white_24dp.png')}
          selectedIcon={require('./image/person.png')}
          title="我"
          selected={this.state.view === 4}
          onPress={() => {
            this.setState({
              view: 4, color: viewProp[4].color, popup: 0,
            });
          }}>
          {this._renderContent(4)}
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}


var styles = StyleSheet.create({
  menu: {
    backgroundColor: '#f0f0f0',
    flex: 1,
  },
  menuHead: {
    height: 80,
    backgroundColor: '#fff',
  },
  menuAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginLeft: 12,
    marginTop: 12,
  },
  menuName: {
    fontSize: 20,
    fontWeight: 'bold',
    left: 96,
    top: 22,
    position: 'absolute',
    color: '#333',
  },
  menuCell: {
    fontSize: 14,
    left: 96,
    top: 48,
    position: 'absolute',
    color: '#333',
  },
  menuItem: {
    height: 44,
    paddingLeft: 20,
    flexDirection:'row',
    alignItems:'center',
    backgroundColor: '#fff',
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  menuText: {
    left: 20,
    fontSize: 16,
    color: '#333',
  },
  menuSpace: {
    height: 44,
    borderColor: '#ccc',
    borderTopWidth: 1 / PixelRatio.get(),
    borderBottomWidth: 1 / PixelRatio.get(),
  },
  menuGroup: {
    backgroundColor: '#fff',
  },
  menuLine: {
    borderColor: '#ccc',
    borderTopWidth: 1 / PixelRatio.get(),
    marginLeft: 64,
  },
  menuSpaceF: {
    height: 44,
    borderColor: '#ccc',
    borderTopWidth: 1 / PixelRatio.get(),
  },
  menuSeparator: {
    borderColor: '#888',
    height: 8,
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
  },
  pageStyle: {
    alignItems: 'center',
    padding: 20,
  },
});

AppRegistry.registerComponent('aadps', () => aadps);
