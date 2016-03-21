'use strict';

var React = require('react-native');

var {
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
  TextInput,
  StatusBar,
  ToastAndroid,
} = React;

var Db = require('./Db');
var myDb = new Db();
var Nav = require('./Nav');
var Pick = require('./Pick');
var Dimensions = require('Dimensions');
var Linking = require('Linking');

var toolbarHeight=56;
var drawerWidth=Dimensions.get('window').width-toolbarHeight;

var _navigator, _main;

var viewProp=[{
  title: '我的大学',
  color: '#ffc107',
  fabIcon: 'image!ic_search_white_24dp',
},{
  title: '院校筛选',
  color: '#8bc34a',
  fabIcon: 'image!ic_star_white_24dp',
},{
  title: '留学资讯',
  color: '#f44336',
  fabIcon: 'image!ic_description_white_24dp',
},{
  title: '即时聊天',
  color: '#2196f3',
  fabIcon: 'image!ic_chat_white_24dp',
},
];

class aadps extends React.Component{
  render() {
    return (
        <Navigator
          style={styles.container}
          initialRoute={{id: 'first'}}
          renderScene={this.navigatorRenderScene}/>
    );
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id) {
      case 'first':
        return (<Main navigator={navigator} />);
      case 'user':
        return (<User navigator={navigator} />);
    }
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    _main = this;
    this.state = {
      currentView: 0,
      profile: ['https://aadps.net/wp-content/uploads/2016/03/nullavatar_big.gif', '请注册或登录', ''],
    };
    myDb.getUser().then(user => {if(user){this.setState({profile: user[0].profile})}});
  }

  logout() {
    myDb.eraseUser();
    this.setState({profile: ['https://aadps.net/wp-content/uploads/2016/03/nullavatar_big.gif', '请注册或登录', '']});
  }

  onPressFab () {
    switch(this.state.currentView){
      case 0: this.setState({currentView: 1}); break;
      case 1: this.setState({currentView: 0}); break;
      default: break;
    }
  }

  render() {
    var navigationView = (
      <ScrollView style={styles.menu}>
      <Image style={styles.menuImage} resizeMode={Image.resizeMode.cover} source={require('./image/header.jpg')}>
      <Image style={styles.menuAvatar} resizeMode={Image.resizeMode.cover} source={{uri: this.state.profile[0]}} />
      <Text style={styles.menuName}>{this.state.profile[1]}</Text>
      <Text style={styles.menuCell}>{this.state.profile[2]}</Text>
      </Image>
      <View style={styles.menuSpace}></View>
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{this.setState({currentView:0});this.drawer.closeDrawer();}}>
      <View style={[styles.menuItem,{backgroundColor: this.state.currentView==0?'#eee':'#fff'}]}>
      <Image style={[styles.menuIcon, {tintColor: '#ffc107'}]}
      resizeMode={Image.resizeMode.stretch}
      source={require('image!ic_star_white_24dp')} />
      <Text style={[styles.menuText,{color: this.state.currentView==0?'#ffc107':'#000000'} ]}>我的大学</Text>
      </View>
      </TouchableHighlight>
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{this.setState({currentView:1});this.drawer.closeDrawer();}}>
      <View style={[styles.menuItem,{backgroundColor: this.state.currentView==1?'#eee':'#fff'}]}>
      <Image style={[styles.menuIcon, {tintColor: '#8bc34a'}]}
      resizeMode={Image.resizeMode.stretch}
      source={require('image!ic_search_white_24dp')} />
      <Text style={[styles.menuText, {color: this.state.currentView==1?'#8bc34a':'#000000'}]}>院校筛选</Text>
      </View>
      </TouchableHighlight>
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{this.setState({currentView:2});this.drawer.closeDrawer();}}>
      <View style={[styles.menuItem,{backgroundColor: this.state.currentView==2?'#eee':'#fff'}]}>
      <Image style={[styles.menuIcon, {tintColor: '#f44336'}]}
      resizeMode={Image.resizeMode.stretch}
      source={require('image!ic_description_white_24dp')} />
      <Text style={[styles.menuText, {color: this.state.currentView==2?'#f44336':'#000000'}]}>留学资讯</Text>
      </View>
      </TouchableHighlight>
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{this.setState({currentView:3});this.drawer.closeDrawer();}}>
      <View style={[styles.menuItem,{backgroundColor: this.state.currentView==3?'#eee':'#fff'}]}>
      <Image style={[styles.menuIcon, {tintColor: '#2196f3'}]}
      resizeMode={Image.resizeMode.stretch}
      source={require('image!ic_chat_white_24dp')} />
      <Text style={[styles.menuText, {color: this.state.currentView==3?'#2196f3':'#000000'}]}>即时聊天</Text>
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
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{!this.state.profile[2]?_navigator.push({id: 'user'}):this.logout();}}><View style={styles.menuItem}>
      <Image style={[styles.menuIcon, {tintColor: '#888888'}]}
      resizeMode={Image.resizeMode.stretch}
      source={!this.state.profile[2]?require('image!ic_person_white_24dp'):require('image!ic_person_outline_white_24dp')} />
      <Text style={styles.menuText}>{!this.state.profile[2]?'注册/登录':'注销'}</Text>
      </View></TouchableHighlight>
      </ScrollView>
    );

    var mainView = <Nav />;
    switch (this.state.currentView) {
      case 0: mainView = <Nav />; break;
      case 1: mainView = <Pick />; break;
      defualt: break;
    }

    return (
      <DrawerLayoutAndroid
      drawerWidth={drawerWidth}
      ref={(drawer) => { this.drawer = drawer; }}
      drawerPosition={DrawerLayoutAndroid.positions.Left}
      renderNavigationView={() => navigationView}>
      <View style={{height: 24, elevation: 4, backgroundColor: viewProp[this.state.currentView].color}}/>
      <ToolbarAndroid
      navIcon={require('image!ic_menu_white_24dp')}
      onIconClicked={() => this.drawer.openDrawer()}
      style={[styles.toolbar,{backgroundColor: viewProp[this.state.currentView].color}]}
      title={viewProp[this.state.currentView].title}
      titleColor='#ffffff'>
      </ToolbarAndroid>
      {mainView}
      <TouchableHighlight style={styles.fab} onPress={()=>{this.onPressFab()}}>
      <View style={[styles.fabView,{backgroundColor: viewProp[this.state.currentView].color}]}>
      <Image style={styles.fabIcon} source={require(viewProp[this.state.currentView].fabIcon)} />
      </View>
      </TouchableHighlight>
      <StatusBar backgroundColor="rgba(52,52,52,0.4)" translucent={true} />
      </DrawerLayoutAndroid>
    );
  }
}

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      register: true,
      user: '',
      passwd: '',
      nick: '',
    };
  }

  login() {
    fetch('https://aadps.net/wp-content/themes/aadps/ajax.php', {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: 'profile=&user='+this.state.user+'&passwd='+this.state.passwd
    })
    .then((response) => response.json())
    .then((profile) => {
      if(profile.length>0) {
        myDb.setUser(this.state.user, this.state.passwd, profile);
        _main.setState({profile: profile});
        _navigator.pop();
      }
      else ToastAndroid.show('手机号或密码错误，请重试！', ToastAndroid.SHORT);
    })
    .catch((error) => {
      ToastAndroid.show('网络错误，请重试！', ToastAndroid.SHORT);
    });
  }

  register() {

  }

  render() {
    var namefield=<View></View>;
    if (this.state.register)namefield =
    <View style={{backgroundColor: '#fff', flexDirection: 'row', height: 40, alignSelf: "stretch"}}>

    <View style={{flex: 0.1, alignItems: 'center', justifyContent: 'center'}}>
    <Image style={{width: 24, height: 24, tintColor: '#888'}}
    resizeMode={Image.resizeMode.cover}
    source={require('image!ic_person_white_24dp')} />
    </View>

    <TextInput underlineColorAndroid='#fff'
    style={{flex: 0.9}}
    autoCorrect={false}
    onChangeText={(nick) => this.setState({nick})}
    value={this.state.nick}
    placeholder={'昵称'}
    />

    </View>;

    return (
      <View style={{flexDirection: "column", flex: 1, }}>
      <View style={{height: 24, elevation: 4, backgroundColor: '#888'}}/>
      <ToolbarAndroid
      navIcon={require('image!ic_arrow_back_white_24dp')}
      onIconClicked={() => {_navigator.pop()} }
      style={[styles.toolbar,{backgroundColor: '#888'}]}
      title={this.state.register?'注册':'登录'}
      titleColor='#ffffff'>
      </ToolbarAndroid>
      <View style={{ flex: 1,}} >
      <Image style={{alignSelf: 'center', margin: 16,}} source={require('./image/logoa.png')} />
      <View style={{backgroundColor: '#fff', flexDirection: 'row', height: 40, alignSelf: "stretch",}}>
      <View style={{flex: 0.1, alignItems: 'center', justifyContent: 'center'}}>
      <Image style={{width: 24, height: 24, tintColor: '#888'}}
      resizeMode={Image.resizeMode.cover}
      source={require('image!ic_phone_android_white_24dp')} />
      </View>
      <TextInput underlineColorAndroid='#fff'
      style={{flex: 0.9}}
      autoCorrect={false}
      onChangeText={(user) => this.setState({user})}
      value={this.state.user}
      placeholder={this.state.register?'11位中国大陆手机号':'手机号或aadps.net账户'}
      />
      </View>
      {namefield}
      <View style={{backgroundColor: '#fff', flexDirection: 'row', height: 40, alignSelf: "stretch"}}>
      <View style={{flex: 0.1, alignItems: 'center', justifyContent: 'center'}}>
      <Image style={{width: 24, height: 24, tintColor: '#888'}}
      resizeMode={Image.resizeMode.cover}
      source={require('image!ic_vpn_key_white_24dp')} />
      </View>
      <TextInput
      style={{flex: 0.9}}
      autoCorrect={false}
      secureTextEntry={true}
      onChangeText={(passwd) => this.setState({passwd})}
      value={this.state.passwd}
      placeholder={'密码'}
      />
      </View>
      <View style={{flexDirection: 'row', width: Dimensions.get('window').width, top: Dimensions.get('window').height-160, position: "absolute", }}>
      <TouchableHighlight style={{flex: 0.5, margin: 12, height: 40, borderRadius: 5}} onPress={()=>{this.state.register?this.register():this.login();}}>
      <View style={[styles.button, {backgroundColor: "#888"}]}>
      <Text style={{alignSelf: 'center', color: '#fff'}}>{this.state.register?'注册':'登录'}</Text>
      </View>
      </TouchableHighlight>
      <TouchableHighlight style={{flex: 0.5, margin: 12, height: 40, borderRadius: 5}} onPress={()=>{this.setState({register:!this.state.register})}}>
      <View style={[styles.button, { backgroundColor: "#f9f9f9"}]}>
      <Text style={{alignSelf: 'center'}}>{this.state.register?'已有账户，登录':'注册新账户'}</Text>
      </View>
      </TouchableHighlight>
      </View>
      </View>
      </View>
    )
  }
}

BackAndroid.addEventListener('hardwareBackPress', () => {
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
  menuImage: {
    height: 192,
    width: drawerWidth,
  },
  menuAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginLeft: 16,
    marginTop: 40,
  },
  menuName: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 16,
    marginTop: 24,
  },
  menuCell: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 16,
  },
  menuItem: {
    height: 48,
    paddingLeft: 16,
    flexDirection:'row',
    alignItems:'center',
    backgroundColor: '#fff',
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  menuText: {
    left: 48,
    fontSize: 16,
    color: '#333333',
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
    height: toolbarHeight,
    elevation: 4,
  },
  pageStyle: {
    alignItems: 'center',
    padding: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    elevation: 6,
    borderRadius: 28,
  },
  fabView: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    width: 24,
    height: 24,
  },
  button:{
    height: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#888',
  },
});

AppRegistry.registerComponent('aadps', () => aadps);
