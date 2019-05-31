/**
 * Sample React Native App
 * https://www.npmjs.com/package/react-native-momosdk
 * @format
 * @flow
 */

import {
  Platform,
  DeviceEventEmitter,
  NativeModules,
  NativeEventEmitter
} from 'react-native';
import RNMomosdk from 'react-native-momosdk';
const RNMomosdkModule = NativeModules.RNMomosdk;
const EventEmitter = new NativeEventEmitter(RNMomosdkModule);

const merchantname = "CGV Cinemas";
const merchantcode = "CGV01";
const merchantNameLabel = "Nhà cung cấp";
const billdescription = "Fast and Furious 8";
const amount = 50000;
const enviroment = "0"; //"0": SANBOX , "1": PRODUCTION

export default class App extends Component < Props > {

  state = {
    textAmount: this.formatNumberToMoney(amount, null, ""),
    amount: amount,
    description: "",
    processing: false
  }
  componentDidMount() {
    EventEmitter.addListener('RCTMoMoNoficationCenterRequestTokenReceived', (response) => {
      try {
        console.log("<MoMoPay>Listen.Event::" + JSON.stringify(response));
        if (response && response.status == 0) {
          //SUCCESS: continue to submit momoToken,phonenumber to server
          let fromapp = response.fromapp; //ALWAYS:: fromapp==momotransfer
          let momoToken = response.data;
          let phonenumber = response.phonenumber;
          let message = response.message;
          let orderId = response.refOrderId;
        } else {
          //let message = response.message;
          //Has Error: show message here
        }
      } catch (ex) {}
    });
    //OPTIONAL
    EventEmitter.addListener('RCTMoMoNoficationCenterRequestTokenState', (response) => {
      console.log("<MoMoPay>Listen.RequestTokenState:: " + response.status);
      // status = 1: Parameters valid & ready to open MoMo app.
      // status = 2: canOpenURL failed for URL MoMo app 
      // status = 3: Parameters invalid
    })
  }


  formatNumberToMoney(number, defaultNum, predicate) {
    predicate = !predicate ? "" : "" + predicate;
    if (number == 0 || number == '' || number == null || number == 'undefined' ||
      isNaN(number) === true ||
      number == '0' || number == '00' || number == '000')
      return "0" + predicate;

    var array = [];
    var result = '';
    var count = 0;

    if (!number) {
      return defaultNum ? defaultNum : "" + predicate
    }

    let flag1 = false;
    if (number < 0) {
      number = -number;
      flag1 = true;
    }

    var numberString = number.toString();
    if (numberString.length < 3) {
      return numberString + predicate;
    }

    for (let i = numberString.length - 1; i >= 0; i--) {
      count += 1;
      if (numberString[i] == "." || numberString[i] == ",") {
        array.push(',');
        count = 0;
      } else {
        array.push(numberString[i]);
      }
      if (count == 3 && i >= 1) {
        array.push('.');
        count = 0;
      }
    }

    for (let i = array.length - 1; i >= 0; i--) {
      result += array[i];
    }

    if (flag1)
      result = "-" + result;

    return result + predicate;
  }

  onPress = async () => {
    let jsonData = {};
    jsonData.enviroment = enviroment; //SANBOX OR PRODUCTION
    jsonData.action = "gettoken"; //DO NOT EDIT
    jsonData.merchantname = merchantname; //edit your merchantname here
    jsonData.merchantcode = merchantcode; //edit your merchantcode here
    jsonData.merchantnamelabel = merchantNameLabel;
    jsonData.description = billdescription;
    jsonData.amount = 5000; //order total amount
    jsonData.orderId = "ID20181123192300";
    jsonData.orderLabel = "Ma don hang";
    jsonData.appScheme = "momocgv20170101"; // iOS App Only , match with Schemes Indentify from your  Info.plist > key URL types > URL Schemes
    // console.log("data_request_payment " + JSON.stringify(jsonData));

    if (Platform.OS === 'android') {
      let dataPayment = await RNMomosdk.requestPayment(jsonData);
      this.momoHandleResponse(dataPayment);
    } else {
      RNMomosdk.requestPayment(jsonData);
    }
  }
  async momoHandleResponse(response) {
    try {
      if (response && response.status == 0) {
        //SUCCESS continue to submit momoToken,phonenumber to server
        let fromapp = response.fromapp; //ALWAYS:: fromapp == momotransfer
        let momoToken = response.data;
        let phonenumber = response.phonenumber;
        let message = response.message;

      } else {
        //let message = response.message;
        //Has Error: show message here
      }
    } catch (ex) {}
  }

  onChangeText = (value) => {
    let newValue = value.replace(/\./g, "").trim();
    let amount = this.formatNumberToMoney(newValue, null, "");
    this.setState({
      amount: newValue,
      textAmount: amount,
      description: ""
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
