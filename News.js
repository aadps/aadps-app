'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  ListView,
  ScrollView,
  TouchableHighlight,
  PixelRatio,
} from 'react-native';

var Linking = require('Linking');

class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      page: 0,
      news: [],
      id: (this.props.id)?this.props.id:0,
    };
  }

  componentDidMount() {
    this.fetchData();
    setInterval(() => {this.checkUpdate()}, 1000);;
  }

  checkUpdate(){
    if (this.props.id && this.props.id != this.state.id){
      this.setState({
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }),
        loaded: false,
        page: 0,
        news: [],
        id: this.props.id,
      });
      this.fetchData();
    }
  }

  fetchData() {
    fetch('https://aadps.net/wp-content/themes/aadps/ajax.php', {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: 'news=&page='+this.state.page
    })
    .then((response) => response.json())
    .then((responseData) => {
      var expandedNews = this.state.news.concat(responseData);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(expandedNews),
        loaded: true,
        page: this.state.page + 1,
        news: expandedNews,
      });
    })
    .done();
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
      dataSource={this.state.dataSource}
      renderRow={this.renderNews}
      style={styles.listView}
      onEndReached={()=>{this.fetchData();}}
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
        <Text style={styles.alert}>资讯载入中...</Text>
        </View>
      )}}
      style={styles.listView} />
    );
  }

  renderNews(news) {
    return (
      <TouchableHighlight
      activeOpacity={0.935}
      onPress={()=>{Linking.openURL(news.link.replace('https', 'http'))}}>
      <View style={styles.container}>
      <Image
      source={{uri: news.thumb}}
      style={styles.thumbnail}
      />
      <View style={styles.rightContainer}>
      <Text style={styles.title}>{news.title.replace(/(\(.+\))/g, '')}</Text>
      <View style={{flexDirection: 'row'}}>
      <Text style={styles.author}>{news.author}</Text>
      <Text style={styles.date}>{news.date}</Text>
      </View>
      </View>
      </View>
      </TouchableHighlight>
    );
  }
}

module.exports = News;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#888',
    borderBottomWidth: 1  / PixelRatio.get(),
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
    color: '#333',
  },
  alert: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
  },
  author: {
    textAlign: 'left',
    color: '#f44336',
    marginRight: 4,
  },
  date: {
    textAlign: 'left',
    color: '#888',
  },
  thumbnail: {
    width: 80,
    height: 80,
    margin: 10,
  },
  listView: {
    backgroundColor: '#f0f0f0',
  },
});
