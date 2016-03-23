var React = require('react-native');

var {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableHighlight,
} = React;

var Dimensions = require('Dimensions');

class Item extends React.Component {
  render() {
    return (
      <View style={styles.item}>
      <Text>新英格兰</Text>
      </View>
    )
  }
}

class Section extends React.Component {
  render() {
    var items = [];
    for(var i = 0; i < 6; i++)items.push(<Item key={i}/>);
    return (
      <View>

      <View style={{width: Dimensions.get('window').width/2-16, padding: 4, borderBottomWidth: 2, borderColor: '#2e7d32', marginTop: 20, marginBottom: 10, marginLeft: 16}}>
      <Text style={{fontSize: 20, color: '#8bc34a',}}>地理位置</Text>
      </View>
      <View style={{flexDirection: 'row', flexWrap: 'wrap', marginLeft: 16}}>
      {items}
      </View>

      </View>
    )
  }
}

class Pick extends React.Component {
  render() {
    var sections = [];
    for(var i = 0; i < 3; i++)sections.push(<Section key={i}/>);
    return (
      <ScrollView>
      {sections}
      </ScrollView>
    )
  }
}

module.exports = Pick;

var styles = StyleSheet.create({
  item: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 2,
    paddingLeft: 8,
    paddingRight: 8,
    margin: 6,
    borderColor: '#888',
  },
  itemActive: {
    borderWidth: 0,
    backgroundColor: '#8bc34a',
  },
  textActive: {
    color: '#fff',
  }
});
