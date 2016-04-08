'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Text,
  Image,
  View,
  ListView,
  TouchableHighlight,
} = React;

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
    };
  }

  componentDidMount() {
    this.fetchData();
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
      onEndReached={()=>{this.setState({page: this.state.page+1});this.fetchData();}}
      />
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
      <Text style={styles.title}>
      资讯载入中...
      </Text>
      </View>
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
      <Text style={styles.author}>{news.author}</Text>
      <Text style={styles.date}>{news.date}</Text>
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
    borderBottomWidth: 1,
    backgroundColor: '#f0f0f0',
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
  author: {
    textAlign: 'left',
    color: '#f44336',
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
