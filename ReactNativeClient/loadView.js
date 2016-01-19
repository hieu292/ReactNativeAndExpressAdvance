var React = require('react-native');
var {
  Component,
  View,
  Text
} = React;

class LoadView extends Component {
  componentWillMount() {
    var navigator = this.props.navigator;
    setTimeout(() => {
      navigator.replace({
        id: 'MainView',
      });
    }, 3000);
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#009933', alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: 'black', fontSize: 32,}}>Thu Do Multimedia App</Text>
      </View>
    );
  }
}

module.exports = LoadView;
