'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  ListView,
  TouchableHighlight,
  Platform,
} from 'react-native';

var Chat = require('./Chat');

class Chan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      chan: [],
    };
    this.fetchData();
  }

  componentDidMount() {
    this._intId = setInterval(() => {this.fetchData()}, 5000);
  }

  componentWillUnmount() {
    clearInterval(this._intId);
  }

  fetchData() {
    this.props.db.getUser().then(user => {
      if(user)fetch('https://aadps.net/wp-content/themes/aadps/ajax.php', {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: 'getchan=&user=' + user.user + '&passwd=' + user.passwd
      })
      .then((response) => response.json())
      .then((responseData) => {
        this.props.db.getChan(responseData)
        .then(channels => {
          if(channels)this.setState({
            dataSource: this.state.dataSource.cloneWithRows(channels),
            loaded: true,
            chan: channels,
          });
        });
      })
      .catch( e => {
        this.props.db.getChan(null)
        .then(channels => {
          if(channels)this.setState({
            dataSource: this.state.dataSource.cloneWithRows(channels),
            loaded: true,
            chan: channels,
          });
        });
      });
    });
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
      dataSource={this.state.dataSource}
      renderRow={(chan)=>{return this.renderChan(chan)}}
      style={styles.listView}
      />
    );
  }

  renderLoadingView() {
    return (
      <ListView
      dataSource={(new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })).cloneWithRows([{}])}
      renderRow={() =>{return(
        <View style={styles.listView}>
        <View style={{height: 160}} />
        <Text style={styles.alert}>好像不大对？( ´・ω・` )</Text>
        <Text style={styles.hint}>在线并登录来向老师们咨询留学问题吧</Text>
        </View>
      )}}
      style={styles.listView} />
    );
  }

  renderChan(chan) {
    return (
      <TouchableHighlight
      activeOpacity={0.935}
      onPress={()=>{
        this.props.db.setChanOld(chan.id);
        this.props.nav.push(Platform.OS === 'android'?{id: 'chat', chan: chan.id, name: chan.name}:{
          component: Chat,
          passProps: {chan: chan.id, db: this.props.db},
          title: chan.name,
          tintColor: '#2196f3'});
        }}>
      <View style={styles.container}>
      <Image
      source={{uri: chan.thumb}}
      style={styles.thumbnail}
      />
      <View style={styles.rightContainer}>
      <Text style={[styles.title, chan.isNew?{color: '#2196f3',}:{color: '#333',}]}>{chan.name}</Text>
      <Text style={styles.msg}>{chan.msg}</Text>
      </View>
      </View>
      </TouchableHighlight>
    );
  }
}

module.exports = Chan;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#888',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginRight: 10,
    marginBottom: 4,
    textAlign: 'left',
  },
  msg: {
    textAlign: 'left',
    color: '#888',
  },
  alert: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 10,
  },
  listView: {
    backgroundColor: '#f0f0f0',
  },
  hint: {
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
    color: '#333',
  },
});
