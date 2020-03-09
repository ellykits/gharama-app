/**
 * @format
 */

import {Navigation} from 'react-native-navigation';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {registerScreens} from "./navigation/navigation";
import {Provider} from "react-redux";
import React from "react";
import {store} from "./store";

const DapaniApp = () => (
    <Provider store={store}>
        <App/>
    </Provider>
);

AppRegistry.registerComponent(appName, () => DapaniApp);

registerScreens();

Navigation.setDefaultOptions({
    animations: {
        push: {
            enabled: false,
        },
        pop: {
            enabled: false,
        },
        setRoot: {
            enabled: false,
        },
    },
});

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            stack: {
                id: 'Stack.Expenses',
                children: [
                    {
                        component: {
                            id: 'Expenses',
                            name: 'Expenses',
                        },
                    },
                ],
            },
        },
    }).then(r => console.log(r));
});
