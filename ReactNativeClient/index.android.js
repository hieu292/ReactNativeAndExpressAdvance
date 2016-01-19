var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Component,
  Text,
  View,
  Navigator,
  TouchableOpacity,
} = React;

var LoadView = require("./loadView");
var MainView = require("./mainView");
var ResultView = require("./resultView");

class reactExpessClient extends Component{
  renderScene(route, navigator){
    var routeId = route.id;
    if (routeId === 'LoadView') {
      return (
        <LoadView
          navigator={navigator} />
      );
    }
    if (routeId === 'MainView') {
      return (
        <MainView
          navigator={navigator} />
      );
    }
    if (routeId === 'ResultView') {
      return (
        <ResultView
          navigator={navigator} />
      );
    }
    return this.noRoute(navigator);
  }
  noRoute(navigator) {
    return (
      <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
        <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            onPress={() => navigator.pop()}>
          <Text style={{color: 'red', fontWeight: 'bold'}}>Hello</Text>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
  return (
    <Navigator
        initialRoute={{id: 'LoadView', name: 'index'}}
        renderScene={this.renderScene.bind(this)}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.FloatFromRight;
        }} />
  );
}
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('reactExpessClient', () => reactExpessClient);
