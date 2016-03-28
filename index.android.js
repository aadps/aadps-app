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

var toolbarHeight = 56;
var drawerWidth = Dimensions.get('window').width-toolbarHeight;

var _navigator;

const viewProp = [{
  title: '我的大学',
  color: '#ffc107',
  fabIcon: 'image!ic_search_white_24dp',
},{
  title: '院校筛选',
  color: '#8bc34a',
  fabIcon: 'image!ic_filter_list_white_24dp',
},{
  title: '留学资讯',
  color: '#f44336',
  fabIcon: 'image!ic_description_white_24dp',
},{
  title: '即时聊天',
  color: '#2196f3',
  fabIcon: 'image!ic_chat_white_24dp',
}];
const list = [{name: '字母A', ids: [1791, 3665, 3675]},
  {name: '字母B', ids: [1560, 1737, 1977, 2198, 2227, 2233, 2242, 3580]},
  {name: '字母C', ids: [177, 925, 928, 930, 1554, 1641, 1647, 1985, 2110, 2192,
  2194, 2238, 3531, 3533, 3535, 3537, 3539, 3541, 3543, 3547, 3549, 3559, 3561,
  3673]},
  {name: '字母D', ids: [1404, 1407, 2116, 3667, 3679, 3681]},
  {name: '字母E', ids: [933]},
  {name: '字母F', ids: [1745, 3563]},
  {name: '字母G', ids: [1593, 1768, 3575, 3634]},
  {name: '字母H', ids: [937, 1988, 2118, 2130, 2246]},
  {name: '字母I', ids: [241, 3644, 3646]},
  {name: '字母K', ids: [3577, 3683]},
  {name: '字母L', ids: [1714]},
  {name: '字母M', ids: [943, 1397, 1756, 1760, 1806, 2202, 2244, 3565, 3640, 3642,
  3648, 3677]},
  {name: '字母N', ids: [945, 1557, 1576, 1617, 3567, 3685]},
  {name: '字母O', ids: [2229, 3569, 3687, 3689]},
  {name: '字母P', ids: [232, 1387, 1718, 1750, 1762, 1801, 3638]},
  {name: '字母R', ids: [947, 1574, 2240, 3571, 3636]},
  {name: '字母S', ids: [1399, 1610, 1770, 1796, 2196, 2206, 2248, 3650]},
  {name: '字母T', ids: [1612, 1724, 1739, 3582, 3661, 3671]},
  {name: '字母V', ids: [1563, 1606, 2112, 3663, 3669]},
  {name: '字母W', ids: [205, 952, 1651, 1733, 1789, 1981, 2126, 2132, 3573, 3652
  ]},
  {name: '字母Y', ids: [1391]}];
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

function buildPick(list, filterResult) {
  if(!filterResult)return[];
  var cnames={};
  for(var i = 0; i< filterResult.length; i++){
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

class aadps extends React.Component{
  render() {
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
        return (<Main navigator = {navigator} />);
      case 'user':
        return (<User navigator = {navigator} />);
      case 'filter':
        return (
          <View style={{flexDirection: "column", flex: 1, }}>
          <View style={{height: 24, elevation: 4, backgroundColor: '#8bc34a'}} />
          <ToolbarAndroid
          navIcon={require('image!ic_arrow_back_white_24dp')}
          onIconClicked={() => {
            _navigator.pop();
            myDb.filter(filterFav).then(result => {pickData = buildPick(list, result)});
          }}
          style={[styles.toolbar,{backgroundColor: '#8bc34a'}]}
          title={'筛选器'}
          titleColor='#fff'>
          </ToolbarAndroid>

          <Pick data={filterData} picked={filterFav} />

          </View>
        );
    }
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 0,
      profile: nullProfile,
    };
  }

  componentDidMount() {
    myDb.filter(filterFav).then(result => {pickData=buildPick(list, result)});
  }

  logout() {
    myDb.eraseUser().then(() => {
      this.forceUpdate();
    });
  }

  onPressFab() {
    switch(this.state.currentView){
      case 0: this.setState({currentView: 1}); break;
      case 1: _navigator.push({id: 'filter'}); break;
      default: break;
    }
  }

  isLoggedIn() {
    return this.state.profile[2];
  }

  render() {

    myDb.getUser().then(user => {
      if(user && this.state.profile[2] != user[0].profile[2])this.setState({profile: user[0].profile});
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
        myDb.getCardData(fav).then(result => {
          if(result)cardData = result;
          else cardData = [];
          this.setState({currentView:0});
        });
      }}>
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
      <TouchableHighlight activeOpacity={0.935} onPress={()=>{this.isLoggedIn()?this.logout():_navigator.push({id: 'user'});}}><View style={styles.menuItem}>
      <Image style={[styles.menuIcon, {tintColor: '#888888'}]}
      resizeMode={Image.resizeMode.stretch}
      source={!this.isLoggedIn()?require('image!ic_person_white_24dp'):require('image!ic_person_outline_white_24dp')} />
      <Text style={styles.menuText}>{this.isLoggedIn()?'注销':'注册/登录'}</Text>
      </View></TouchableHighlight>
      </ScrollView>
    );

    var mainView=<View />;
    switch (this.state.currentView) {
      case 0: mainView = <Nav data={cardData} />; break;
      case 1: mainView = <Pick data={pickData} picked={fav} />;
      break;
      defualt: break;
    }

    return (
      <DrawerLayoutAndroid
      drawerWidth={drawerWidth}
      ref={(drawer) => { this.drawer = drawer; }}
      drawerPosition={DrawerLayoutAndroid.positions.Left}
      renderNavigationView={() => navigationView}>

      <Image style={{width: 0, height: 0,}} source={require('image!ic_filter_list_white_24dp')} />
      <StatusBar backgroundColor="rgba(52,52,52,0.4)" translucent={true} />

      <View style={{height: 24, elevation: 4, backgroundColor: viewProp[this.state.currentView].color}}/>
      <ToolbarAndroid
      navIcon={require('image!ic_menu_white_24dp')}
      onIconClicked={() => this.drawer.openDrawer()}
      style={[styles.toolbar,{backgroundColor: viewProp[this.state.currentView].color}]}
      title={viewProp[this.state.currentView].title}
      titleColor='#ffffff'></ToolbarAndroid>
      {mainView}
      <TouchableHighlight style={styles.fab} onPress={()=>{this.onPressFab()}}>
      <View style={[styles.fabView,{backgroundColor: viewProp[this.state.currentView].color}]}>
      <Image style={styles.fabIcon} source={require(viewProp[this.state.currentView].fabIcon)} />
      </View>
      </TouchableHighlight>
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
        _navigator.pop();
      }
      else ToastAndroid.show('手机号或密码错误，请重试！', ToastAndroid.SHORT);
    })
    .catch((error) => {
      ToastAndroid.show('网络错误，请重试！', ToastAndroid.SHORT);
    });
  }

  validateCell(number) {
    return number.match(/(^(13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7})$/);
  }

  register() {
    if(!this.validateCell(this.state.user)){
      ToastAndroid.show('请输入手机号！', ToastAndroid.SHORT);
      return;
    }
    fetch('https://aadps.net/wp-content/themes/aadps/ajax.php', {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: 'register=&type=android&user='+this.state.user+'&passwd='+this.state.passwd+'&nick='+this.state.nick
    })
    .then((response) => response.json())
    .then((profile) => {
      if(profile.length>0) {
        myDb.setUser(this.state.user, this.state.passwd, profile);
        _navigator.pop();
      }
      else ToastAndroid.show('该用户已注册，请直接登录！', ToastAndroid.SHORT);
    })
    .catch((error) => {
      ToastAndroid.show('网络错误，请重试！', ToastAndroid.SHORT);
    });
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
      <View style={{height: 24, elevation: 4, backgroundColor: '#888'}} />
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
  menuHead: {
    height: 130,
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
    fontSize: 20,
    left: 108,
    top: 50,
    position: 'absolute',
  },
  menuCell: {
    fontSize: 14,
    left: 108,
    top: 80,
    position: 'absolute',
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
    left: 44,
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
