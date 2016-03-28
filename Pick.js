var React = require('react-native');

var {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  UIManager,
} = React;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

var Db = require('./Db');
var myDb = new Db();
var Dimensions = require('Dimensions');
var LayoutAnimation = require('LayoutAnimation');

class Item extends React.Component {
  render() {
    LayoutAnimation.spring();
    var picked = this.props.picked.indexOf(this.props.data.id) >= 0;
    return (
      <TouchableWithoutFeedback onPress={() => {
        var array = this.props.picked;
        var index = array.indexOf(this.props.data.id);

        if (index === -1) {
          array.push(this.props.data.id);
        } else {
          array.splice(index, 1);
        }

        this.props.onChange(array);
        myDb.setFav(array, parseInt(new Date().getTime() / 1000));
      }}>
      <View style={[styles.item, picked?styles.itemPicked:{}]}>
      <Text style={picked?styles.textPicked:{}}>{this.props.data.name}</Text>
      </View>
      </TouchableWithoutFeedback>
    )
  }
}

class Section extends React.Component {
  render() {
    if(this.props.data.data.length > 0){
      var items = [];
      for(var i = 0; i < this.props.data.data.length; i++)
        items.push(<Item key={i} data={this.props.data.data[i]} picked={this.props.picked} onChange={this.props.onChange}/>);
      return (
        <View>

        <View style={styles.section}>
        <Text style={styles.heading}>{this.props.data.name}</Text>
        </View>
        <View style={styles.itemContainer}>
        {items}
        </View>

        </View>
      )
    }else return <View />
  }
}

class Pick extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      picked: this.props.picked,
    };
  }

  render() {
    if(this.props.data.length > 0){
      var sections = [];
      for(var i = 0; i < this.props.data.length; i++)
      sections.push(<Section key={i} data={this.props.data[i]} picked={this.state.picked} onChange={this.onChange}/>);
      return (
        <ScrollView>
        {sections}
        </ScrollView>
      )
    }else return(
      <View style={styles.container}>
      <Text style={styles.message}>空空如也呢( ´・ω・` )</Text>
      <Text style={styles.hint}>点击右下角按钮调整一下范围吧</Text>
      </View>
    )
  }

  onChange = (data) => {
    this.setState({picked: data});
  };

}

module.exports = Pick;

var styles = StyleSheet.create({
  section: {
    width: Dimensions.get('window').width/2-16,
    padding: 4,
    borderBottomWidth: 2,
    borderColor: '#888',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 16
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 16
  },
  item: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 2,
    paddingLeft: 8,
    paddingRight: 8,
    margin: 6,
    borderColor: '#888',
  },
  itemPicked: {
    borderColor: '#fff',
    backgroundColor: '#8bc34a',
  },
  textPicked: {
    color: '#fff',
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
