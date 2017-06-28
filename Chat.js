'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Clipboard,
  Text
} from 'react-native';

import {Navigator} from 'react-native-deprecated-custom-components';
import {GiftedChat, Send} from 'react-native-gifted-chat';

var STATUS_BAR_HEIGHT = 24;

class Chat extends Component {
  getChat() {
    fetch('https://aadps.net/wp-content/themes/aadps/ajax.php', {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: 'getchat=&user='+this._user+'&passwd='+this._passwd+'&chan='+this.props.chan+'&id='+this._id
    })
    .then((response) => response.json())
    .then((response) => {
      if(response.length>0){
        for(var i in response){
          var message = new Array();
          message[0]={};
          var t = response[i]["date"].split(/[- :]/);
          message[0].createdAt = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
          message[0].text = response[i].text;
          message[0]._id = parseInt(response[i].uniqueId);
          this._id = message[0]._id;
          message[0].user = {};
          message[0].user.name = response[i].name;
          message[0].user.avatar = response[i].image.uri;
          message[0].user._id = (response[i].position=="left")?2:1;
          this.setMessages(message.concat(this._messages));
        }
      }
    }).catch((error) => {});
  }

  constructor(props) {
    super(props);

    this._isMounted = false;
    this._messages = [];
    this._user = '';
    this._passwd = '';
    this._id = 0;
    this._intId = null;
    this.props.db.getUser().then(user => {
      this._user = user.user;
      this._passwd = user.passwd;
      this.getChat();
    });

    this.state = {
      messages: this._messages,
      isLoadingEarlierMessages: false,
      error: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this._intId = setInterval(() => {this.getChat()}, 5000);
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this._intId);
  }

  setMessageStatus(uniqueId, status) {
    let messages = [];
    let found = false;

    for (let i = 0; i < this._messages.length; i++) {
      if (this._messages[i].uniqueId === uniqueId) {
        let clone = Object.assign({}, this._messages[i]);
        clone.status = status;
        messages.push(clone);
        found = true;
      } else {
        messages.push(this._messages[i]);
      }
    }

    if (found === true) {
      this.setMessages(messages);
    }
  }

  setMessages(messages) {
    this._messages = messages;

    // append the message
    this.setState({
      messages: messages,
    });
  }

  handleSend(message = []) {

    // Your logic here
    // Send message.text to your server
    fetch('https://aadps.net/wp-content/themes/aadps/ajax.php', {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: 'setchat=&user='+this._user+'&passwd='+this._passwd+'&chan='+this.props.chan+'&text='+message[0].text
    })
    .then(() => {this.getChat();this.setState({error: null})})
    .catch((error) => {
      this.setState({error: '因网络原因，消息“' + message[0].text + '”发送失败'});
    });
  }

  renderFooter(props) {
    if (this.state.error) {
      return (
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          {this.state.error}
        </Text>
      </View>
      );
    }
    return null;
  }

  renderSend(props) {
    return (
      <Send
        {...props}
        label = '发送'
      />
    );
  }

  onLongPress(context, message) {
      if (message.text) {
        const options = [
          '复制',
          '取消',
        ];
        const cancelButtonIndex = options.length - 1;
        context.actionSheet().showActionSheetWithOptions({
          options,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(message.text);
              break;
          }
        });
      }
  }

  render() {
    return (
      <GiftedChat

        locale={'zh-cn'}
        messages={this.state.messages}
        onSend={this.handleSend.bind(this)}
        renderSend={this.renderSend}
        renderFooter={this.renderFooter.bind(this)}
        onLongPress={this.onLongPress.bind(this)}

        placeholder={'输入聊天内容'}
        user={{
          _id: 1,
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});

module.exports = Chat;
