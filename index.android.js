'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  DrawerLayoutAndroid,
  ToolbarAndroid,
  TouchableHighlight,
  Navigator,
  BackAndroid,
} from 'react-native';

var Db = require('./Db');
var myDb = new Db();
var User = require('./User');
var Nav = require('./Nav');
var Pick = require('./Pick');
var News = require('./News');
var Chat = require('./Chat');
var Chan = require('./Chan');
var Dimensions = require('Dimensions');
var Linking = require('Linking');
var _navigator = null;
var drawerWidth = Dimensions.get('window').width - 56;

var _main;

const viewProp = [{
  title: '我的大学',
  color: '#ffc107',
  actions: [{title: '排序', icon: require('image!ic_swap_vert_white_24dp'), show: 'always'}],
},{
  title: '院校筛选',
  color: '#8bc34a',
  actions: [{title: '筛选', icon: require('image!ic_filter_list_white_24dp'), show: 'always'},
  {title: '排序', icon: require('image!ic_swap_vert_white_24dp'), show: 'always'}],
},{
  title: '留学资讯',
  color: '#f44336',
  actions: [],
},{
  title: '即时聊天',
  color: '#2196f3',
  actions: [],
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
const nullProfile = ['', '请注册或登录', ''];

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
          body: 'regchat=&type=android&user='+user.user+'&passwd='+user.passwd+'&chan='+chan
        }).catch(function(e) {});
      }
    });
  });
}

class aadps extends React.Component{
  render() {
    if(this.props.view != undefined)view = this.props.view;
    return (
      <Navigator
      style={styles.container}
      initialRoute={{id: 'main'}}
      renderScene={this.navigatorRenderScene}/>
    );
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;

    switch (route.id) {
      case 'main':
        return (<Main nav = {navigator} />);
      case 'user':
        return (<User nav = {navigator} db = {myDb} syncFav = {syncFav}/>);
      case 'filter':
        return (
          <View style={{flexDirection: "column", flex: 1, }}>
          <ToolbarAndroid
          navIcon={require('image!ic_arrow_back_white_24dp')}
          onIconClicked={() => {
            navigator.pop();
            myDb.filter(filterFav).then(result => {
              _main.refs.myPick.set(buildPick(result));
            });
          }}
          style={[styles.toolbar,{backgroundColor: '#8bc34a'}]}
          title={'筛选器'}
          titleColor='#fff'>
          </ToolbarAndroid>

          <Pick data={filterData} picked={filterFav} isPerm={false}/>

          </View>
        );
      case 'chat':
        return (
          <View style={{flexDirection: "column", flex: 1, }}>
          <ToolbarAndroid
          navIcon={require('image!ic_arrow_back_white_24dp')}
          onIconClicked={() => {
            navigator.pop();
          }}
          style={[styles.toolbar,{backgroundColor: '#2196f3'}]}
          title={route.name}
          titleColor='#fff'>
          </ToolbarAndroid>

          <Chat db = {myDb} chan ={route.chan} />

          </View>
        );
    }
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 0,
      profile: nullProfile,
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

  onActionSelected(pos) {
    switch(this.state.view){
      case 0: if(pos === 0){
        order++;
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
      break;
      case 1: if(pos === 0)this.props.nav.push({id: 'filter'})
              else if(pos === 1){
                order++;
                myDb.filter(filterFav).then(result => {
                  _main.refs.myPick.set(buildPick(result));
                });
              }
      break;
      default: break;
    }
  }

  isLoggedIn() {
    return this.state.profile[2];
  }

  render() {

    myDb.getUser().then(user => {
      if(user && this.state.profile[2] != user.profile[2])this.setState({profile: user.profile});
      else if(!user && this.isLoggedIn())this.setState({profile: nullProfile});
    });
    var navigationView = (
      <ScrollView style={styles.menu}>

      <Image style={styles.menuHead} resizeMode={Image.resizeMode.cover} source={require('./image/head.jpg')}>
      <Image style={styles.menuAvatar} resizeMode={Image.resizeMode.cover} source={this.isLoggedIn()?{uri: this.state.profile[0]}:require('./image/nullavatar.gif')} />
      <Text style={styles.menuName}>{this.state.profile[1]}</Text>
      <Text style={styles.menuCell}>{this.state.profile[2]}</Text>
      </Image>

      <View style={styles.menuSpace}></View>
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{
        this.drawer.closeDrawer();
        myDb.getFav().then(dbFav => {
          if(dbFav)fav = dbFav.fav;
          else fav = [];
          myDb.getCardData(fav, order%3).then(result => {
            if(result)cardData = result;
            else cardData = [];
            this.setState({view:0});
          });
        })
      }}>
      <View style={[styles.menuItem,{backgroundColor: this.state.view==0?'#eee':'#fff'}]}>
      <Image style={[styles.menuIcon, {tintColor: '#ffc107'}]}
      resizeMode={Image.resizeMode.stretch}
      source={require('image!ic_star_white_24dp')} />
      <Text style={[styles.menuText,{color: this.state.view==0?'#ffc107':'#000000'} ]}>我的大学</Text>
      </View>
      </TouchableHighlight>
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{
        this.drawer.closeDrawer();
        syncFav();
        myDb.getFav().then(dbFav => {
          if(dbFav)fav = dbFav.fav;
          else fav = [];
          myDb.filter(filterFav).then(result => {
            this.setState({view:1});
            _main.refs.myPick.set(buildPick(result));
          });
        });
      }}>
      <View style={[styles.menuItem,{backgroundColor: this.state.view==1?'#eee':'#fff'}]}>
      <Image style={[styles.menuIcon, {tintColor: '#8bc34a'}]}
      resizeMode={Image.resizeMode.stretch}
      source={require('image!ic_search_white_24dp')} />
      <Text style={[styles.menuText, {color: this.state.view==1?'#8bc34a':'#000000'}]}>院校筛选</Text>
      </View>
      </TouchableHighlight>
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{this.setState({view:2});this.drawer.closeDrawer();}}>
      <View style={[styles.menuItem,{backgroundColor: this.state.view==2?'#eee':'#fff'}]}>
      <Image style={[styles.menuIcon, {tintColor: '#f44336'}]}
      resizeMode={Image.resizeMode.stretch}
      source={require('image!ic_description_white_24dp')} />
      <Text style={[styles.menuText, {color: this.state.view==2?'#f44336':'#000000'}]}>留学资讯</Text>
      </View>
      </TouchableHighlight>
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{regChat();this.setState({view:3});this.drawer.closeDrawer();}}>
      <View style={[styles.menuItem,{backgroundColor: this.state.view==3?'#eee':'#fff'}]}>
      <Image style={[styles.menuIcon, {tintColor: '#2196f3'}]}
      resizeMode={Image.resizeMode.stretch}
      source={require('image!ic_chat_white_24dp')} />
      <Text style={[styles.menuText, {color: this.state.view==3?'#2196f3':'#000000'}]}>即时聊天</Text>
      </View>
      </TouchableHighlight>
      <View style={styles.menuSeparator}></View>
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{Linking.openURL('tel:4000223774')}}><View style={styles.menuItem}>
      <Image style={[styles.menuIcon, {tintColor: '#888888'}]}
      resizeMode={Image.resizeMode.stretch}
      source={require('image!ic_call_white_24dp')} />
      <Text style={styles.menuText}>电话咨询</Text>
      </View></TouchableHighlight>
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{Linking.openURL('http://aadps.net/about')}}><View style={styles.menuItem}>
      <Image style={[styles.menuIcon, {tintColor: '#888888'}]}
      resizeMode={Image.resizeMode.stretch}
      source={require('image!ic_help_white_24dp')} />
      <Text style={styles.menuText}>关于AADPS</Text>
      </View></TouchableHighlight>
      <View style={styles.menuSeparator}></View>
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{this.isLoggedIn()?this.logout():this.props.nav.push({id: 'user'});}}><View style={styles.menuItem}>
      <Image style={[styles.menuIcon, {tintColor: '#888888'}]}
      resizeMode={Image.resizeMode.stretch}
      source={!this.isLoggedIn()?require('image!ic_person_white_24dp'):require('image!ic_person_outline_white_24dp')} />
      <Text style={styles.menuText}>{this.isLoggedIn()?'注销':'注册/登录'}</Text>
      </View></TouchableHighlight>
      </ScrollView>
    );

    var mainView=<View />;
    switch (this.state.view) {
      case 0: mainView = <Nav db={myDb} data={cardData} />; break;
      case 1: mainView = <Pick db={myDb} data={lists[order%3]} picked={fav} isPerm={true} ref="myPick" />; break;
      case 2: mainView = <News />; break;
      case 3: mainView = <Chan db={myDb}  nav = {this.props.nav}/>; break;
      defualt: break;
    }

    return (
      <DrawerLayoutAndroid
      drawerWidth={drawerWidth}
      ref={(drawer) => { this.drawer = drawer; }}
      drawerPosition={DrawerLayoutAndroid.positions.Left}
      renderNavigationView={() => navigationView}>

      <ToolbarAndroid
      navIcon={require('image!ic_menu_white_24dp')}
      onIconClicked={() => this.drawer.openDrawer()}
      style={[styles.toolbar,{backgroundColor: viewProp[this.state.view].color}]}
      title={viewProp[this.state.view].title}
      titleColor='#ffffff'
      actions={viewProp[this.state.view].actions}
      onActionSelected={(pos)=>this.onActionSelected(pos)}
      ></ToolbarAndroid>

      {mainView}

      </DrawerLayoutAndroid>
    );
  }
}

BackAndroid.addEventListener('hardwareBackPress', () => {
  if(_navigator == null){
    return false;
  }
  if (_navigator.getCurrentRoutes().length === 1  ) {
     return false;
  }
  _navigator.pop();
  return true;
});

var styles = StyleSheet.create({
  menu: {
    backgroundColor: '#fff',
    flex: 1,
  },
  menuHead: {
    height: 104,
    width: drawerWidth,
  },
  menuAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginLeft: 16,
    marginTop: 16,
  },
  menuName: {
    fontSize: 20,
    fontWeight: 'bold',
    left: 104,
    top: 30,
    position: 'absolute',
    color: '#fff',
  },
  menuCell: {
    fontSize: 14,
    left: 104,
    top: 56,
    position: 'absolute',
    color: '#fff',
  },
  menuItem: {
    height: 48,
    paddingLeft: 40,
    flexDirection:'row',
    alignItems:'center',
    backgroundColor: '#fff',
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  menuText: {
    left: 40,
    fontSize: 16,
    color: '#333',
  },
  menuSpace: {
    height: 8,
  },
  menuSeparator: {
    borderColor: '#888',
    height: 8,
    borderBottomWidth: 1,
  },
  toolbar: {
    height: 56,
    elevation: 4,
  },
  pageStyle: {
    alignItems: 'center',
    padding: 20,
  },
});

AppRegistry.registerComponent('aadps', () => aadps);
