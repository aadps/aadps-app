'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  WebView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  UIManager,
  Alert,
} from 'react-native';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

var Dimensions = require('Dimensions');
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
    LayoutAnimation.linear();
    this.setState({height: 0, closed: true});
    var array = this.props.fav;
    var index = array.indexOf(this.props.data.id);
    array.splice(index, 1);
    this.props.db.setFav(array, parseInt(new Date().getTime() / 1000));
  }

  onExpand() {
    LayoutAnimation.spring();
    if(this.state.expanded)this.setState({height: 240, expanded: false});
    else this.setState({height: 140, expanded: true});
  }

  render() {
    var content, card, guide;
    if(this.props.data.guide){
      guide = <TouchableHighlight  activeOpacity={0.935} onPress={() => {Linking.openURL('http://aadps.net/2016/' + this.props.data.guide + '.html')}}>
        <View style={styles.link}>
        <Text style={styles.linkText}>院校指南</Text>
        </View>
        </TouchableHighlight>;
    }else guide = <View />;
    if(this.state.expanded){
      content =       <WebView style={[styles.stat, {height: this.state.height - 154}]}
            source={{uri: 'http://aadps.net/wp-content/themes/aadps/stat.php?id=' + this.props.data.id}}
            javaScriptEnabled={true}
            domStorageEnabled={false}
            onLoadEnd={()=>{
              LayoutAnimation.spring();
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
    <TouchableWithoutFeedback onPress={() => {if(this.props.data.comment)Alert.alert('降权理由', this.props.data.comment)}}>
    <View>
    <Text style={[styles.line2, {color: this.props.data.comment?'#f00':'#333'}]}>{this.props.data.ranking}</Text>
    </View>
    </TouchableWithoutFeedback>
    </View>

    <View style={{position: 'absolute', left: windowWidth / 2 + 65,}}>
    <Text style={styles.line1}>CEEB</Text>
    <Text style={styles.line2}>{this.props.data.ceeb}</Text>
    </View>

    </View>

    <View style={styles.linkList}>

    <TouchableHighlight  activeOpacity={0.935} onPress={() => {Linking.openURL('http://aadps.net/2016/' + this.props.data.id + '.html')}}>
    <View style={styles.link}>
    <Text style={styles.linkText}>文书题目</Text>
    </View>
    </TouchableHighlight>

    {guide}

    </View>

    </View>;

    if(this.state.closed)card = <View />;
    else card = <View>
    <Image style={styles.photo} resizeMode={Image.resizeMode.cover} source={{uri: 'http://aadps.net/wp-content/uploads/2016/02/' + this.props.data.id + '.jpg'}} />
    <View style={styles.textArea}>
    <View style={styles.background} />

    <Text style={styles.caption}>{this.props.data.name}</Text>
    <Text style={styles.caption}>{this.props.data.cname + ' ' + this.props.data.type + ' ' + this.props.data.type2}</Text>
    <View style={{height: 6}} />

    <View style={styles.iconBar}>

    <TouchableWithoutFeedback onPress={()=>this.onExpand()}>
    <Image style={styles.icon}
    resizeMode={Image.resizeMode.stretch}
    source={this.state.expanded?require('image!ic_expand_less_white_24dp'):require('image!ic_expand_more_white_24dp')} />
    </TouchableWithoutFeedback>

    <TouchableWithoutFeedback onPress={()=>this.onClose()}>
    <Image style={styles.icon}
    resizeMode={Image.resizeMode.stretch}
    source={require('image!ic_close_white_24dp')} />
    </TouchableWithoutFeedback>

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
    this.props.db.loadColleges();
  }

  render() {
    if(this.props.data && this.props.data.length > 0){
      var cards = [], fav = [];
      for(var i = 0; i < this.props.data.length; i++)fav.push(this.props.data[i].id);
      for(var i = 0; i < this.props.data.length; i++)
        cards.push(<Card db={this.props.db} key={i} data={this.props.data[i]} fav={fav} onChange={this.onChange} />);
      return (
        <ScrollView style={{backgroundColor: '#f0f0f0',}}>
        {cards}
        <View style={{height: 8}} />
        </ScrollView>
      )
    }else return(
      <View style={styles.container}>
      <Text style={styles.alert}>空空如也呢( ´・ω・` )</Text>
      <Text style={styles.hint}>点击左上角菜单去登录或选校吧</Text>
      </View>
    )
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
    color: '#fff',
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
    backgroundColor: '#f0f0f0',
  },
  alert: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
  },
  hint: {
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
    color: '#333',
  },
});
