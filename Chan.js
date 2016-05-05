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
  }

  componentDidMount() {
    this.fetchData();
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
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData),
          loaded: true,
          news: responseData,
        });
      })
      .done();
    });
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
      dataSource={this.state.dataSource}
      renderRow={(chan)=>{return this.renderNews(chan)}}
      style={styles.listView}
      />
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
      <Text style={styles.title}>
      请先注册或登录吧( ´・ω・` )
      </Text>
      </View>
    );
  }

  renderNews(chan) {
    return (
      <TouchableHighlight
      activeOpacity={0.935}
      onPress={()=>{this.props.nav.push({id: 'chat', chan: chan.id, name: chan.name})}}>
      <View style={styles.container}>
      <Image
      source={{uri: chan.thumb}}
      style={styles.thumbnail}
      />
      <View style={styles.rightContainer}>
      <Text style={styles.title}>{chan.name}</Text>
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
  msg: {
    textAlign: 'left',
    color: '#888',
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
});
