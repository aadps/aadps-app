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

class Pick extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      picked: this.props.picked,
      data: this.props.data,
    };
  }

  renderItem(data) {
    var picked = this.props.picked.indexOf(data.id) >= 0;
    return (
      <TouchableWithoutFeedback key={data.id} onPress={() => {
        var array = this.props.picked;
        var index = array.indexOf(data.id);

        if (index === -1) {
          array.push(data.id);
        } else {
          array.splice(index, 1);
        }

        this.onChange(array);
        if(this.props.isPerm)myDb.setFav(array, parseInt(new Date().getTime() / 1000));
      }}>
      <View style={[styles.item, picked?styles.itemPicked:{}]}>
      <Text style={picked?{color: '#fff'}:{color: '#888'}}>{data.name}</Text>
      </View>
      </TouchableWithoutFeedback>
    )
  }

  renderSection(data) {
    if(data.data.length > 0){
      var items = [];
      for(var i = 0; i < data.data.length; i++)
        items.push(this.renderItem(data.data[i]));
      return (
        <View key={data.name}>

        <View style={styles.section}>
        <Text style={styles.heading}>{data.name}</Text>
        </View>
        <View style={styles.itemContainer}>
        {items}
        </View>

        </View>
      )
    }else return <View key={data.name}/>
  }

  render() {
    if(this.state.data.length > 0){
      var sections = [];
      for(var i = 0; i < this.state.data.length; i++)
        sections.push(this.renderSection(this.state.data[i]));
      return (
        <ScrollView style={{backgroundColor: '#f0f0f0',}}>
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

  set(data) {
    LayoutAnimation.spring();
    this.setState({data: data});
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
    borderColor: '#f0f0f0',
    backgroundColor: '#8bc34a',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
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
    color: '#333',
  },
});
