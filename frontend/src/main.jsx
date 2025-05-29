import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from "react-router";
import {Provider} from "react-redux";
import {PersistGate} from 'redux-persist/integration/react'
import App from './App.jsx'
import {store, persistor} from "./store/store.js";
import {ThemeProvider} from 'styled-components';
import {theme} from './styles/theme.js';



createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider theme={theme}>
                    <BrowserRouter>
                        <App/>
                    </BrowserRouter>
                </ThemeProvider>
            </PersistGate>
        </Provider>
    </StrictMode>
)
