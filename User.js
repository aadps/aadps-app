'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  ToolbarAndroid,
  TouchableHighlight,
  PixelRatio,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode';

var Dimensions = require('Dimensions');

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
        this.props.db.setUser(this.state.user, this.state.passwd, profile)
        .then(()=>{this.props.syncFav()});
        this.props.nav.pop();
      }
      else Alert.alert('登录失败', '手机号或密码错误');
    })
    .catch((error) => {
      console.warn(error);
      Alert.alert('登录失败', '网络错误');
    });
  }

  validateCell(number) {
    return number.match(/(^(13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7})$/);
  }

  register() {
    if(!this.validateCell(this.state.user)){
      Alert.alert('注册失败', '请输入正确的手机号');
      return;
    }
    fetch('https://aadps.net/wp-content/themes/aadps/ajax.php', {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: 'register=&type='+ (Platform.OS === 'android'? 'android' : 'ios')+'&user='+this.state.user+'&passwd='+this.state.passwd+'&nick='+this.state.nick
    })
    .then((response) => response.json())
    .then((profile) => {
      if(profile.length>0) {
        this.props.db.setUser(this.state.user, this.state.passwd, profile);
        this.props.nav.pop();
      }
      else Alert.alert('注册失败', '用户已注册');
    })
    .catch((error) => {
      Alert.alert('注册失败', '网络错误');
    });
  }

  render() {
    var namefield=<View />;
    if (this.state.register)namefield =
    <View style={styles.container}>
    <View style={styles.iconBox}>
    <Image style={styles.icon}
    resizeMode={ImageResizeMode.cover}
    source={require('./image/ic_person_white_24dp.png')} />
    </View>
    <TextInput
    underlineColorAndroid='#fff'
    selectionColor="#009688"
    style={styles.input}
    autoCorrect={false}
    onChangeText={(nick) => this.setState({nick})}
    value={this.state.nick}
    placeholder={'昵称'}
    placeholderTextColor='#888'
    />
    </View>;

    if(Platform.OS === 'android')return (
      <View style={{flexDirection: "column", flex: 1, backgroundColor: '#f0f0f0'}}>
      <ToolbarAndroid
            navIcon={require('./image/ic_arrow_back_white_24dp.png')}
            onIconClicked={() => {this.props.nav.pop()} }
            style={[styles.toolbar,{backgroundColor: '#888'}]}
            title={this.state.register?'注册':'登录'}
            titleColor='#ffffff'>
      </ToolbarAndroid>
      <View style={{flex: 1,}} >
      <View style={{height: 44,}} />
      {namefield}
      <View style={styles.container}>
      <View style={styles.iconBox}>
      <Image style={styles.icon}
      resizeMode={ImageResizeMode.cover}
      source={require('./image/ic_phone_android_white_24dp.png')} />
      </View>
      <TextInput
      underlineColorAndroid='#fff'
      selectionColor="#009688"
      style={styles.input}
      autoCorrect={false}
      onChangeText={(user) => this.setState({user})}
      value={this.state.user}
      placeholder={this.state.register?'11位中国大陆手机号':'手机号或aadps.net账户'}
      placeholderTextColor='#888'
      />
      </View>
      <View style={styles.container}>
      <View style={styles.iconBox}>
      <Image style={styles.icon}
      resizeMode={ImageResizeMode.cover}
      source={require('./image/ic_vpn_key_white_24dp.png')} />
      </View>
      <TextInput
      underlineColorAndroid='#fff'
      selectionColor="#009688"
      style={styles.input}
      autoCorrect={false}
      secureTextEntry={true}
      onChangeText={(passwd) => this.setState({passwd})}
      value={this.state.passwd}
      placeholder={'密码'}
      placeholderTextColor='#888'
      />
      </View>
      <View style={{borderTopWidth: 1 / PixelRatio.get(), borderColor: '#ccc', height: 36,}} />
      <View style={styles.buttonRow}>
      <TouchableHighlight style={styles.buttonBox} onPress={()=>{this.state.register?this.register():this.login();}}>
      <View style={[styles.button, {backgroundColor: "#009688"}]}>
      <Text style={{alignSelf: 'center', color: '#fff'}}>{this.state.register?'注册':'登录'}</Text>
      </View>
      </TouchableHighlight>
      <TouchableHighlight style={styles.buttonBox} onPress={()=>{this.setState({register:!this.state.register})}}>
      <View style={[styles.button, {borderWidth: 1, backgroundColor: "#f0f0f0"}]}>
      <Text style={{alignSelf: 'center', color: '#888'}}>{this.state.register?'已有账户，登录':'注册新账户'}</Text>
      </View>
      </TouchableHighlight>
      </View>
      </View>
      </View>
    )
    else return (
      <ScrollView style={{flex: 1, backgroundColor: '#f0f0f0'}}>
      <View style={{height: 44 - 1 / PixelRatio.get(),}} />
      {namefield}
      <View style={styles.container}>
      <View style={styles.iconBox}>
      <Image style={styles.icon}
      resizeMode={ImageResizeMode.cover}
      source={require('./image/ic_phone_android_white_24dp.png')} />
      </View>
      <TextInput
      underlineColorAndroid='#fff'
      selectionColor="#009688"
      style={styles.input}
      autoCorrect={false}
      onChangeText={(user) => this.setState({user})}
      value={this.state.user}
      placeholder={this.state.register?'11位中国大陆手机号':'手机号或aadps.net账户'}
      placeholderTextColor='#888'
      />
      </View>
      <View style={styles.container}>
      <View style={styles.iconBox}>
      <Image style={styles.icon}
      resizeMode={ImageResizeMode.cover}
      source={require('./image/ic_vpn_key_white_24dp.png')} />
      </View>
      <TextInput
      underlineColorAndroid='#fff'
      selectionColor="#009688"
      style={styles.input}
      autoCorrect={false}
      secureTextEntry={true}
      onChangeText={(passwd) => this.setState({passwd})}
      value={this.state.passwd}
      placeholder={'密码'}
      placeholderTextColor='#888'
      />
      </View>
      <View style={{borderTopWidth: 1 / PixelRatio.get(), borderColor: '#ccc', height: 36,}} />
      <View style={styles.buttonRow}>
      <TouchableHighlight style={styles.buttonBox} onPress={()=>{this.state.register?this.register():this.login();}}>
      <View style={[styles.button, {backgroundColor: "#009688"}]}>
      <Text style={{alignSelf: 'center', color: '#fff'}}>{this.state.register?'注册':'登录'}</Text>
      </View>
      </TouchableHighlight>
      <TouchableHighlight style={styles.buttonBox} onPress={()=>{this.setState({register:!this.state.register})}}>
      <View style={[styles.button, {borderWidth: 1, backgroundColor: "#f0f0f0"}]}>
      <Text style={{alignSelf: 'center', color: '#888'}}>{this.state.register?'已有账户，登录':'注册新账户'}</Text>
      </View>
      </TouchableHighlight>
      </View>
      </ScrollView>
    )
  }
}

module.exports = User;

var styles = StyleSheet.create({
  toolbar: {
    height: 56,
    elevation: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
  },
  buttonBox: {
    flex: 0.5,
    margin: 8,
    height: 44,
    borderRadius: 5,
  },
  button: {
    height: 44,
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: '#888',
  },
  input: {
    flex: 0.85,
    color: '#333',
  },
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 44,
    alignSelf: "stretch",
    borderTopWidth: 1 / PixelRatio.get(),
    borderColor: '#ccc',
  },
  iconBox: {
    flex: 0.15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#888'
  }
});
