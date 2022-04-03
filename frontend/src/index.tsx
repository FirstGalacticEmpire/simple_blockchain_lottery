import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
// @ts-ignore
import {transitions, positions, Provider as AlertProvider} from 'react-alert'
// @ts-ignore
import AlertTemplate from "react-alert-template-basic";

import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient();

declare global {
    interface Window {
        ethereum: any;
    }
}

const options = {
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    offset: '30px',
    transition: transitions.SCALE
}


ReactDOM.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AlertProvider template={AlertTemplate} {...options}>
                <App/>
            </AlertProvider>
        </QueryClientProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
