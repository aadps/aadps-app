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
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode';

import {lists, filterData, nullProfile} from './Const';

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
    this._intId = setInterval(() => {this.fetchView()}, 2000);
  }

  componentWillUnmount() {
    clearInterval(this._intId);
  }

  fetchView() {
    myDb.getPushView().then(view => {
      if(view){
        this.setState({view: view, color: viewProp[view].color, popup: 0,});
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
      case 2: mainView=<News id={Math.random()}/>; break;
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
        <Image style={styles.menuAvatar} resizeMode={ImageResizeMode.cover} source={this.isLoggedIn()?{uri: this.state.profile[0]}:require('./image/nullavatar.gif')} />
        <Text style={styles.menuName}>{this.state.profile[1]}</Text>
        <Text style={styles.menuCell}>{this.state.profile[2]}</Text>
        </View>
        </TouchableHighlight>

        <View style={styles.menuSpace}></View>
        <View style={styles.menuGroup}>

        <TouchableHighlight onPress={()=>{Linking.openURL('https://aadps.net/service1')}}><View style={styles.menuItem}>
        <Text style={styles.menuText}>美本规划服务</Text>
        </View></TouchableHighlight>

        <View style={styles.menuLine}></View>

        <TouchableHighlight onPress={()=>{Linking.openURL('https://aadps.net/service2')}}><View style={styles.menuItem}>
        <Text style={styles.menuText}>美本申请服务</Text>
        </View></TouchableHighlight>

        <View style={styles.menuLine}></View>

        <TouchableHighlight onPress={()=>{Linking.openURL('https://aadps.net/about')}}><View style={styles.menuItem}>
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
          icon={require('./image/tab/ic_star_border_white_24dp.png')}
          selectedIcon={require('./image/tab/ic_star_white_24dp.png')}
          iconSize={24}
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
          icon={require('./image/tab/ic_search_white_24dp.png')}
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
          icon={require('./image/tab/ic_description_white_24dp.png')}
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
          icon={require('./image/tab/ic_chat_white_24dp.png')}
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
          icon={require('./image/tab/ic_person_outline_white_24dp.png')}
          selectedIcon={require('./image/tab/ic_person_white_24dp.png')}
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
