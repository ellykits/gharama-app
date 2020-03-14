
# Gharama App  
Gharama (Swahili word meaning *expenses*) app is an expense listing react native Android app. This app fetches expenses from the provided API and allows users to add notes and upload receipt pictures to each expense.  
  
See the [API details](https://github.com/pleo-io/mobile-challenge/tree/master/api) on how to setup the backend server.   
Note:  
  
> The backend server stores data in memory thus data will be lost when restarted.  
  
## Features  
- User can list expenses  
- User can add a comment on an expense  
- User can filter on expenses (client side filters)  
- User can add a receipt image on an expense  
  <p><img src ="./pics/welcome.png" width="360" />  <img src ="./pics/demo.gif" width="360" /></p>  
  
## Setting up the project  
  
Follow the steps on the documentation on how to [setup react native for Android](https://reactnative.dev/docs/getting-started). Once you are done with the setup run the following commands.

```bash
# install dependencies
$ yarn install
# start react native local development server
$ yarn start
# run the app on emulator
$ yarn run android
```

Note:
 > Start the react local development server before running the application on an already running emulator or connected device.
  
## Running tests  
Run the test with this command `yarn test`. This will also produce test coverage report located in the **coverage** directory  
  
## Libraries used  
* [Retrofit](https://square.github.io/retrofit/) - REST API client library for Android (for posting comments) 
* [StfalconImageViewer](https://github.com/stfalcon-studio/StfalconImageViewer) - Android image viewer library (for displaying the receipts) 
* [ImagePicker](https://github.com/Dhaval2404/ImagePicker) - Android image picker library (for picking taking picture/uploading existing images from the phone)
* [react-native-navigation](https://github.com/wix/react-native-navigation) - For navigating between screens
* [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons) - Icons library
