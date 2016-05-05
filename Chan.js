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
            news: channels,
          });
        });
      })
      .catch( e => {
        this.props.db.getChan(null)
        .then(channels => {
          if(channels)this.setState({
            dataSource: this.state.dataSource.cloneWithRows(channels),
            loaded: true,
            news: channels,
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
      onPress={()=>{this.props.db.setChanOld(chan.id);this.props.nav.push({id: 'chat', chan: chan.id, name: chan.name});}}>
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
