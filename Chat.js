'use strict';

import React, { Component } from 'react';
import {
  Linking,
  Platform,
  ActionSheetIOS,
  Dimensions,
  View,
  Text,
  Navigator,
  PixelRatio,
} from 'react-native';

var GiftedMessenger = require('react-native-gifted-messenger');


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
    .then((message) => {
      if(message.length>0){
        for(var i in message){
          var t = message[i]["date"].split(/[- :]/);
          message[i]["date"] = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
        }
        this.handleReceive(message);
        if(this._messages.length != 0)this._id = this._messages[this._messages.length-1].uniqueId;
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

  handleSend(message = {}) {

    // Your logic here
    // Send message.text to your server
    fetch('https://aadps.net/wp-content/themes/aadps/ajax.php', {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: 'setchat=&user='+this._user+'&passwd='+this._passwd+'&chan='+this.props.chan+'&text='+message.text
    })
    .then(() => {this.getChat()})
    .catch((error) => {
      message.uniqueId = -Math.round(Math.random() * 10000);
      this.setMessages(this._messages.concat(message));
      this.setMessageStatus(message.uniqueId, 'ErrorButton');
    });

    // if you couldn't send the message to your server :
    // this.setMessageStatus(message.uniqueId, 'ErrorButton');
  }

  handleReceive(message = {}) {
    // make sure that your message contains :
    // text, name, image, position: 'left', date, uniqueId
    this.setMessages(this._messages.concat(message));
  }

  onErrorButtonPress(message = {}) {
    // Your logic here
    // re-send the failed message

    // remove the status
    fetch('https://aadps.net/wp-content/themes/aadps/ajax.php', {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: 'setchat=&user='+this._user+'&passwd='+this._passwd+'&chan='+this.props.chan+'&text='+message.text
    })
    .then(() => {
      for(var i = this._messages.length - 1; i >= 0; i--){
        if(this._messages[i].uniqueId == message.uniqueId){
          this._messages.splice(i, 1);
          this.setState({messages: this._messages});
          break;
        }
      }
      this.getChat();
    });
  }

  // will be triggered when the Image of a row is touched
  onImagePress(message = {}) {
    // Your logic here
    // Eg: Navigate to the user profile
  }

  render() {
    return (
      <GiftedMessenger
        ref={(c) => this._GiftedMessenger = c}

        styles={{
          bubble: {
            flex: 0.5,
            borderRadius: 15,
            paddingLeft: 14,
            paddingRight: 14,
            paddingBottom: 10,
            paddingTop: 8,
          },
          container: {
            backgroundColor: '#f0f0f0',
          },
          bubbleLeft: {
            backgroundColor: '#fff',
            borderWidth: 1 / PixelRatio.get(),
            borderColor: '#888',
            marginRight: 48,
          },
          textLeft: {
            color: '#333',
          },
          textInputContainer: {
            height: 44,
            borderTopWidth: 1 / PixelRatio.get(),
            borderColor: '#bbb',
            flexDirection: 'row',
            paddingLeft: 10,
            paddingRight: 10,
            backgroundColor: '#fff',
          },
          bubbleRight: {
            backgroundColor: '#2196f3',
            marginLeft: 48,
          },
        }}

        dateLocale={'zh-cn'}
        autoFocus={false}
        messages={this.state.messages}
        handleSend={this.handleSend.bind(this)}
        onErrorButtonPress={this.onErrorButtonPress.bind(this)}
        maxHeight={Platform.OS === 'android'?Dimensions.get('window').height - Navigator.NavigationBar.Styles.General.NavBarHeight - STATUS_BAR_HEIGHT:Dimensions.get('window').height}

        senderImage={null}
        displayNames={true}
        placeholder={'输入聊天内容'}
        sendButtonText={'发送'}

        parseText={true}
        handlePhonePress={this.handlePhonePress}
        handleUrlPress={this.handleUrlPress}
      />
    );
  }

  handleUrlPress(url) {
    Linking.openURL(url);
  }

  handlePhonePress(phone) {
    Linking.openURL('tel:' + phone);
  }
}

module.exports = Chat;
