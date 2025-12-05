import React from 'react';
import { Provider } from 'react-redux';
import store from './reducer/store';

const SetupRedux = ({ children }) => <Provider store={store}>{children}</Provider>;

export default SetupRedux;
