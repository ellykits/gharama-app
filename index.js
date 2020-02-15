/**
 * @format
 */

import {Navigation} from 'react-native-navigation';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {registerScreens} from 'navigation/navigation';

AppRegistry.registerComponent(appName, () => App);

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        id: 'Home',
        children: [
          {
            component: {
              name: 'Expenses',
            },
          },
        ],
      },
    },
  });
});
