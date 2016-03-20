var React = require('react-native');

var {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  WebView,
  TouchableOpacity,
} = React;

var Dimensions = require('Dimensions');
var ProgressBar = require('ProgressBarAndroid');

var cardWidth=Dimensions.get('window').width-16;

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stat: null,
      height: 240,
      loading: null,
      sign: '+',
    };
  }
  _onLoadEndStat(){
    this.setState({loading: null,});
  }

  _onPressStat() {
    if(!this.state.stat)this.setState({stat:
      <View>
        <View style={{marginTop: 8, marginLeft: 8, marginRight: 8, borderBottomWidth: 1, borderColor: '#aaaaaa',}}/>
        <WebView style={styles.stat}
          source={{uri: 'http://aadps.net/m/'}}
          javaScriptEnabled={true}
          domStorageEnabled={false}
          onLoadEnd={()=>{this._onLoadEndStat()}} />
      </View>,
      height: 480,
      loading: <Image style={styles.loading}
              resizeMode={Image.resizeMode.stretch}
              source={require('./image/loading.gif')}/>,
      sign: '-',
    });
    else this.setState({
      stat: null,
      height: 240,
      sign: '+',
    });
  }

  render() {
     return (
       <View style={[styles.card,{height:this.state.height}]}>
        <Image style={styles.photo} resizeMode={Image.resizeMode.cover} source={{uri: "http://aadps.qiniudn.com/wp-content/uploads/2016/02/930.jpg"}} />
        <View style={styles.textArea}>
          <View style={styles.background} />
          <Text style={styles.caption}>University of Stanford</Text>
          <Text style={styles.caption}>斯坦福大学 私立/公立 综合</Text>
          <View style={{height: 6}} />
        </View>
        <View style={styles.right}>
          <Image style={styles.star}
            resizeMode={Image.resizeMode.stretch}
            source={require('image!ic_star_white_24dp')} />
          <TouchableOpacity style={{marginTop: 34,}} onPress={()=>{this._onPressStat()}}>
              <Text style={styles.link}>图表[{this.state.sign}]</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection:'row',}}>

        <View>
        <Text style={styles.geoen}>Ithaca, NY</Text>
        <Text style={styles.geo}>市郊</Text>
        </View>
        <View style={{position: 'absolute', left: Dimensions.get('window').width/2-7,}}>
        <Text style={styles.date}>3月1日</Text>
        <Text style={styles.text}>转学申请截止</Text>
        </View>
        </View>
        <View style={styles.linkList}>
          <Text style={[styles.link,{marginRight: 20,}]}>文书题目</Text>
          <Text style={[styles.link,{marginRight: 20,}]}>院校指南</Text>
        </View>
        {this.state.stat}
        {this.state.loading}
       </View>
     )
   }
 }

class Nav extends React.Component {
   render() {
     return (
       <ScrollView style={{backgroundColor:'#eeeeee'}}>
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <View style={{height: 8}} />
       </ScrollView>
     )
   }
 }

module.exports = Nav;

var styles = StyleSheet.create({
  loading:{position: 'absolute',
    left: Dimensions.get('window').width/2-30,
    top: 300,
    width: 50,
    height: 50,
  },
  stat: {
    height: 240,
    marginLeft: 2,
    marginRight: 2,
    marginTop: 6,
  },
  right:{
    position: 'absolute',
    right: 12,
    top: 150,
    alignItems: 'flex-end',
  },
  star: {
    width: 24,
    height: 24,
    tintColor: '#ffc107',
  },
  caption: {
    fontSize: 20,
    color: '#ffffff',
    marginLeft: 10,
  },
  geo: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333333',
  },
  geoen: {
    marginLeft: 12,
    fontSize: 14,
    marginTop: 9,
    color: '#888888',
  },
  text: {
    fontSize: 16,
    color: '#333333',
  },
  date: {
    fontSize: 14,
    marginTop: 9,
    color: '#888888',
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
    marginLeft: 12,
    marginTop: 18,
  },
  link: {
    color: '#ffc107',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  card: {
    marginLeft: 7,
    marginRight: 7,
    marginTop: 8,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#888',
  },
});
