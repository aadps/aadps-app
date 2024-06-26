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
  BackAndroid,
  ImageBackground
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode';

import {lists, filterData, nullProfile} from './Const';

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
  actions: [{title: '排序', icon: require('./image/ic_swap_vert_white_24dp.png'), show: 'always'}],
},{
  title: '院校筛选',
  color: '#8bc34a',
  actions: [{title: '筛选', icon: require('./image/ic_filter_list_white_24dp.png'), show: 'always'},
  {title: '排序', icon: require('./image/ic_swap_vert_white_24dp.png'), show: 'always'}],
},{
  title: '留学资讯',
  color: '#f44336',
  actions: [],
},{
  title: '即时聊天',
  color: '#2196f3',
  actions: [],
}];

var order = 0;
var cardData = [];
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

class aadps extends Component{
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
          navIcon={require('./image/ic_arrow_back_white_24dp.png')}
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
          navIcon={require('./image/ic_arrow_back_white_24dp.png')}
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
    this._intId = setInterval(() => {this.fetchView()}, 2000);
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

      <ImageBackground style={styles.menuHead} resizeMode={ImageResizeMode.cover} source={require('./image/head.jpg')}>
      <Image style={styles.menuAvatar} resizeMode={ImageResizeMode.cover} source={this.isLoggedIn()?{uri: this.state.profile[0]}:require('./image/nullavatar.gif')} />
      <Text style={styles.menuName}>{this.state.profile[1]}</Text>
      <Text style={styles.menuCell}>{this.state.profile[2]}</Text>
      </ImageBackground>

      <View style={styles.menuSpace}></View>
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{
        this.drawer.closeDrawer();
        this.setState({view:0});
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
      <View style={[styles.menuItem,{backgroundColor: this.state.view==0?'#eee':'#fff'}]}>
      <Image style={[styles.menuIcon, {tintColor: '#ffc107'}]}
      resizeMode={ImageResizeMode.stretch}
      source={require('./image/ic_star_white_24dp.png')} />
      <Text style={[styles.menuText,{color: this.state.view==0?'#ffc107':'#000000'} ]}>我的大学</Text>
      </View>
      </TouchableHighlight>
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{
        this.drawer.closeDrawer();
        this.setState({view:1});
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
      <View style={[styles.menuItem,{backgroundColor: this.state.view==1?'#eee':'#fff'}]}>
      <Image style={[styles.menuIcon, {tintColor: '#8bc34a'}]}
      resizeMode={ImageResizeMode.stretch}
      source={require('./image/ic_search_white_24dp.png')} />
      <Text style={[styles.menuText, {color: this.state.view==1?'#8bc34a':'#000000'}]}>院校筛选</Text>
      </View>
      </TouchableHighlight>
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{this.setState({view:2});this.drawer.closeDrawer();}}>
      <View style={[styles.menuItem,{backgroundColor: this.state.view==2?'#eee':'#fff'}]}>
      <Image style={[styles.menuIcon, {tintColor: '#f44336'}]}
      resizeMode={ImageResizeMode.stretch}
      source={require('./image/ic_description_white_24dp.png')} />
      <Text style={[styles.menuText, {color: this.state.view==2?'#f44336':'#000000'}]}>留学资讯</Text>
      </View>
      </TouchableHighlight>
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{regChat();this.setState({view:3});this.drawer.closeDrawer();}}>
      <View style={[styles.menuItem,{backgroundColor: this.state.view==3?'#eee':'#fff'}]}>
      <Image style={[styles.menuIcon, {tintColor: '#2196f3'}]}
      resizeMode={ImageResizeMode.stretch}
      source={require('./image/ic_chat_white_24dp.png')} />
      <Text style={[styles.menuText, {color: this.state.view==3?'#2196f3':'#000000'}]}>即时聊天</Text>
      </View>
      </TouchableHighlight>
      <View style={styles.menuSeparator}></View>
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{Linking.openURL('https://aadps.net/service1')}}>
      <View style={styles.menuItem}>
        <View style={styles.menuIcon} />
      <Text style={styles.menuText}>美本留学规划</Text>
      </View></TouchableHighlight>
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{Linking.openURL('https://aadps.net/service2')}}>
      <View style={styles.menuItem}>
        <View style={styles.menuIcon} />
      <Text style={styles.menuText}>美本留学申请</Text>
      </View></TouchableHighlight>
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{Linking.openURL('https://aadps.net/about')}}>
      <View style={styles.menuItem}>
        <View style={styles.menuIcon} />
      <Text style={styles.menuText}>关于AADPS</Text>
      </View></TouchableHighlight>
      <View style={styles.menuSeparator}></View>
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{this.isLoggedIn()?this.logout():this.props.nav.push({id: 'user'});}}><View style={styles.menuItem}>
      <Image style={[styles.menuIcon, {tintColor: '#888888'}]}
      resizeMode={ImageResizeMode.stretch}
      source={!this.isLoggedIn()?require('./image/ic_person_white_24dp.png'):require('./image/ic_person_outline_white_24dp.png')} />
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
      navIcon={require('./image/ic_menu_white_24dp.png')}
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
