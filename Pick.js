var React = require('react-native');

var {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableWithoutFeedback,
} = React;

var Dimensions = require('Dimensions');

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.data.id,
      name: this.props.data.name,
    };
  }

  render() {
    var picked = this.props.picked.indexOf(this.props.data.id) >= 0;
    return (
      <TouchableWithoutFeedback onPress={() => {
        var array = this.props.picked;
        var index = array.indexOf(this.state.id);

        if (index === -1) {
          array.push(this.state.id);
        } else {
          array.splice(index, 1);
        }

        this.props.onChange(array);
      }}>
      <View style={[styles.item, picked?styles.itemPicked:{}]}>
      <Text style={picked?styles.textPicked:{}}>{this.state.name}</Text>
      </View>
      </TouchableWithoutFeedback>
    )
  }
}

class Section extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.data.name,
      data: this.props.data.data,
    };
  }

  render() {
    var items = [];
    for(var i = 0; i < this.state.data.length; i++)
      items.push(<Item key={i} data={this.state.data[i]} picked={this.props.picked} onChange={this.props.onChange}/>);
    return (
      <View>

      <View style={styles.section}>
      <Text style={styles.heading}>{this.state.name}</Text>
      </View>
      <View style={styles.itemContainer}>
      {items}
      </View>

      </View>
    )
  }
}

class Pick extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      picked: this.props.picked,
    };
  }

  render() {
    var sections = [];
    for(var i = 0; i < this.state.data.length; i++)
      sections.push(<Section key={i} data={this.state.data[i]} picked={this.state.picked} onChange={this.onChange}/>);
    return (
      <ScrollView>
      {sections}
      </ScrollView>
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
  }
});
