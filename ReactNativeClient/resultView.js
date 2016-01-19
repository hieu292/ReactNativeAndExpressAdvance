var React = require('react-native');
var config = require('./config');
var {
    StyleSheet,
    View,
    Component,
    TouchableHighlight,
    ListView,
    Text,
    Navigator,
    TouchableOpacity,
} = React;

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
          onPress={() => navigator.parentNavigator.pop()}>
        <Text style={{color: 'white', margin: 10,}}>
          Main
        </Text>
      </TouchableOpacity>
    );
  },
  RightButton(route, navigator, index, navState) {
    return null;
  },
  Title(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
        <Text style={{color: 'white', margin: 10, fontSize: 16}}>
          Result
        </Text>
      </TouchableOpacity>
    );
  }
};

class ResultView extends Component{
  constructor(props){
    super(props);
    this.state = {
      todoSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
    };



  }
  componentWillMount(){
    fetch(config.host+"/api/taskCompleted", {method: "GET"})
    .then((response) => response.json())
    .then((responseData) => {
      this.items = responseData;
      this.setState({
      todoSource: this.state.todoSource.cloneWithRows(this.items)
    });
    }).catch((error) => {console.warn(error)});

    fetch(config.host+"/api/totalTask", {method: "GET"})
    .then((response) => response.json())
    .then((responseData) => {
      this.totalTask = responseData.total;
    }).catch((error) => {console.warn(error)});
    fetch(config.host+"/api/totalTaskCompleted", {method: "GET"})
    .then((response) => response.json())
    .then((responseData) => {
      this.completedTask =responseData.total;
    }).catch((error) => {console.warn(error)});
    fetch(config.host+"/api/totalTaskInProgress", {method: "GET"})
    .then((response) => response.json())
    .then((responseData) => {
      this.inProcessTask = responseData.total;
    }).catch((error) => {console.warn(error)});
  }
  renderScene(){
    return (
      <View style={styles.appContainer}>
      <View style={styles.titleView}>
      </View>
          <TouchableHighlight
            style={styles.button}
            underlayColor='#dddddd'>
            <Text style={styles.btnText}>Total Task: {this.totalTask} tasks</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            underlayColor='#dddddd'>
            <Text style={styles.btnText}>Completed Task: {this.completedTask} tasks</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            underlayColor='#dddddd'>
            <Text style={styles.btnText}>In Process Task: {this.inProcessTask} tasks</Text>
          </TouchableHighlight>
          <Text style={{color:"red"}}>List Completed tasks:</Text>
        <ListView
          dataSource={this.state.todoSource}
          renderRow={this.renderRow.bind(this)} />
      </View>
    );
  }
  renderRow(rowData) {
    return (
      <TouchableHighlight
        underlayColor='#dddddd' >
        <View>
          <View style={styles.row}>
            <Text style={styles.todoText}>{rowData.nameTask}</Text>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }
  render() {
    return (
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator}
          navigationBar={
            <Navigator.NavigationBar style={{backgroundColor: '#246dd5'}}
                routeMapper={NavigationBarRouteMapper} />
          } />
    );
  }

}
var styles = StyleSheet.create({
  appContainer:{
    flex: 1
  },
  titleView:{
    backgroundColor: '#48afdb',
    paddingTop: 30,
    paddingBottom: 30,
    flexDirection: 'row'
  },
  inputcontainer: {
    marginTop: 5,
    padding: 10,
    flexDirection: 'row'
  },
  button: {
    height: 36,
    flexDirection: 'row',
    backgroundColor: '#48afdb',
    justifyContent: 'center',
    color: '#FFFFFF',
    borderRadius: 4,
  },
  btnText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 6,
  },
  input: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48afdb',
    borderRadius: 4,
    color: '#48BBEC'
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    height: 44
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  todoText: {
    flex: 1,
  }
});
module.exports = ResultView;
