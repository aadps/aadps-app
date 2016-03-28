var React = require('react-native');

var {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  WebView,
  TouchableHighlight,
  TouchableOpacity,
  UIManager,
} = React;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

var Db = require('./Db');
var myDb = new Db();
var Dimensions = require('Dimensions');
var ProgressBar = require('ProgressBarAndroid');
var Linking = require('Linking');
var LayoutAnimation = require('LayoutAnimation');

var windowWidth = Dimensions.get('window').width;
var cardWidth = windowWidth - 16;

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      height: 240,
      closed: false,
    };
  }

  onClose() {
    LayoutAnimation.spring();
    this.setState({height: 0, closed: true});
    var array = this.props.fav;
    var index = array.indexOf(this.props.data.id);
    array.splice(index, 1);
    this.props.onChange(array);
    myDb.setFav(array, parseInt(new Date().getTime() / 1000));
  }

  onExpand() {
    LayoutAnimation.easeInEaseOut();
    if(this.state.expanded)this.setState({height: 240, expanded: false});
    else this.setState({height: 140, expanded: true});
  }

  render() {
    var content, card;
    if(this.state.expanded){
      content =       <WebView style={[styles.stat, {height: this.state.height - 150}]}
            source={{uri: 'http://aadps.net/wp-content/themes/aadps/stat.php?id=' + this.props.data.id}}
            javaScriptEnabled={true}
            domStorageEnabled={false}
            onLoadEnd={()=>{
              LayoutAnimation.easeInEaseOut();
              this.setState({height: 390});
            }} />;

    }else content = <View>
    <View style={{flexDirection:'row', height: 60,}}>

    <View style={{position: 'absolute', left: 10,}}>
    <Text style={styles.line1}>{this.props.data.city}</Text>
    <Text style={styles.line2}>{this.props.data.setting}</Text>
    </View>

    <View style={{position: 'absolute', left: windowWidth / 2 - 7,}}>
    <Text style={styles.line1}>A指数</Text>
    <Text style={styles.line2}>99</Text>
    </View>

    <View style={{position: 'absolute', left: windowWidth / 2 + 65,}}>
    <Text style={styles.line1}>CEEB</Text>
    <Text style={styles.line2}>1234</Text>
    </View>

    </View>

    <View style={styles.linkList}>

    <TouchableHighlight  activeOpacity={0.935} onPress={() => {Linking.openURL('http://aadps.net/2016/' + this.props.data.id + '.html')}}>
    <View style={styles.link}>
    <Text style={styles.linkText}>文书题目</Text>
    </View>
    </TouchableHighlight>

    </View>

    </View>;

    if(this.state.closed)card = <View />;
    else card = <View>
    <Image style={styles.photo} resizeMode={Image.resizeMode.cover} source={{uri: 'http://aadps.qiniudn.com/wp-content/uploads/2016/02/' + this.props.data.id + '.jpg'}} />
    <View style={styles.textArea}>
    <View style={styles.background} />

    <Text style={styles.caption}>{this.props.data.name}</Text>
    <Text style={styles.caption}>{this.props.data.cname + ' ' + this.props.data.type + ' ' + this.props.data.type2}</Text>
    <View style={{height: 6}} />

    <View style={styles.iconBar}>

    <TouchableOpacity activeOpacity={0.935} onPress={()=>this.onExpand()}>
    <Image style={styles.icon}
    resizeMode={Image.resizeMode.stretch}
    source={this.state.expanded?require('image!ic_expand_less_white_24dp'):require('image!ic_expand_more_white_24dp')} />
    </TouchableOpacity>

    <TouchableOpacity activeOpacity={0.935} onPress={()=>this.onClose()}>
    <Image style={styles.icon}
    resizeMode={Image.resizeMode.stretch}
    source={require('image!ic_close_white_24dp')} />
    </TouchableOpacity>

    </View>
    </View>
    {content}
    </View>;

    return (
      <View style={[styles.card,{height:this.state.height},this.state.closed?{}:styles.cardOpen]}>
      {card}
      </View>
    )
  }
}

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fav: this.props.fav,
    };
  }

  render() {
    if(this.props.data.length > 0){
      var cards = [];
      for(var i = 0; i < this.props.data.length; i++)
      cards.push(<Card key={i} data={this.props.data[i]} fav={this.state.fav} onChange={this.onChange}/>);
      return (
        <ScrollView>
        {cards}
        <View style={{height: 8}} />
        </ScrollView>
      )
    }else return(
      <View style={styles.container}>
      <Text style={styles.message}>空空如也呢( ´・ω・` )</Text>
      <Text style={styles.hint}>点击右下角按钮去选校吧</Text>
      </View>
    )
  }

  onChange = (data) => {
    this.setState({picked: data});
  }
}

module.exports = Nav;

var styles = StyleSheet.create({
  stat: {
    marginTop: 6,
  },
  iconBar: {
    position: 'absolute',
    right: 12,
    top: 12,
    flexDirection: 'row',
  },
  icon: {
    width: 24,
    height: 24,
    margin: 6,
  },
  caption: {
    fontSize: 20,
    color: '#ffffff',
    marginLeft: 10,
  },
  line2: {
    fontSize: 16,
    color: '#333',
  },
  line1: {
    fontSize: 14,
    marginTop: 9,
    color: '#888',
  },
  photo: {
    height: 140,
    width: cardWidth,
    borderRadius: 5,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  textArea: {
    height: 60,
    width: cardWidth,
    top: 80,
    position: 'absolute',
  },
  background: {
    backgroundColor: "#444",
    opacity: 0.5,
    height: 60,
    width: cardWidth,
    top: 0,
    position: 'absolute',
    borderRadius: 5,
  },
  linkList: {
    flexDirection:'row',
    marginLeft: 4,
  },
  link: {
    backgroundColor: '#fff',
    padding: 6,
  },
  linkText: {
    color: '#ffc107',
    fontSize: 16,
  },
  card: {
    marginLeft: 7,
    marginRight: 7,
    borderRadius: 5,
  },
  cardOpen: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#888',
    marginTop: 8,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
  },
  hint: {
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
  },
});
