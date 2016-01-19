var React = require('react-native');
var config = require('./config');
window.navigator.userAgent = "react-native";
var AwesomeButton = require('react-native-awesome-button')

var io = require('socket.io-client/socket.io');

var {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  ListView,
  Alert,
  Navigator,
  TouchableOpacity
} = React;

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    return null;
  },
  RightButton(route, navigator, index, navState) {
    return null;
  },
  Title(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
        <Text style={{color: 'white', margin: 10, fontSize: 16}}>
          Main View
        </Text>
      </TouchableOpacity>
    );
  }
};

class MainView extends Component {
  constructor(props){
    super(props);
    this.socket = io(config.host, {jsonp: false});

    this.state = {
      newTodo: '',
      todoSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
    };
    fetch(config.host+"/api/taskInProgress", {method: "GET"})
    .then((response) => response.json())
    .then((responseData) => {
      this.items = responseData;
      this.setState({
      todoSource: this.state.todoSource.cloneWithRows(this.items)
    });
    }).catch((error) => {console.warn(error)});
  }
  componentDidMount(){
    //Add
    this.socket.on('add', (dataReturn) => {
      this.items.push({_id: dataReturn._id, nameTask: dataReturn.nameTask});
      this.setState({
      todoSource: this.state.todoSource.cloneWithRows(this.items)
    });
    });
    //removeTodo
    this.socket.on('remove', (dataReturn) => {
      this.items = this.items.filter((x) => x._id !== dataReturn._id);
      this.setState({
        todoSource: this.state.todoSource.cloneWithRows(this.items)
      })
    });

  }
  _onPressButtonPOST(){
    if(this.state.newTodo !== ''){
      fetch(config.host + "/api/task", {method: "POST", headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }, body: JSON.stringify({nameTask: this.state.newTodo})})
      .then((response) => response.json())
      .then((responseData) => {
        Alert.alert("POST response", JSON.stringify(responseData.message));
        this.setState({ newTodo : '' });
      }).catch((error) => {console.warn(error);});
    }

  }
  removeTodo(rowData) {
    fetch(config.host + "/api/task/"+rowData._id, {method: "DELETE"})
    .then((response) => response.json())
    .then((responseData) => {
      Alert.alert("DELETE response", JSON.stringify(responseData.message));
    })
    .catch((error) => {console.warn(error);});
  }
  render() {
    return (
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigationBar={
            <Navigator.NavigationBar style={{backgroundColor: '#246dd5', alignItems: 'center'}}
                routeMapper={NavigationBarRouteMapper} />
          } />
    );
  }
  renderScene(route, navigator) {
    return (
      <View style={styles.appContainer}>
        <View style={styles.titleView}>
        </View>
        <View style={styles.inputcontainer}>
          <TextInput style={styles.input} onChangeText={(nameTask) => this.setState({newTodo: nameTask})} value={this.state.newTodo}/>
          <TouchableHighlight
            style={styles.button}
            onPress={() => this._onPressButtonPOST()}
            underlayColor='#dddddd'>
            <Text style={styles.btnText}>Add!</Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight
            style={styles.buttonResult}
            onPress={this.gotoNext.bind(this)}>
          <Text style={styles.btnText}>View Result</Text>
        </TouchableHighlight>
        <ListView
          dataSource={this.state.todoSource}
          renderRow={this.renderRow.bind(this)} />
      </View>
    );
  }
  gotoNext() {
    this.props.navigator.push({
      id: 'ResultView',
      name: 'Result View',
    });
  }

  renderRow(rowData) {
    return (
      <TouchableHighlight
        underlayColor='#dddddd'
        onPress={() => this.removeTodo(rowData)}>
        <View>
          <View style={styles.row}>
            <Text style={styles.todoText}>{rowData.nameTask}</Text>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
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
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#48afdb',
    justifyContent: 'center',
    color: '#FFFFFF',
    borderRadius: 4,
  },
  buttonResult: {
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
  },
});
module.exports = MainView;
