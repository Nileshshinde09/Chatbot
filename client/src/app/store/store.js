import {configureStore} from '@reduxjs/toolkit';
import themeSlice from '../slices/themeSlice.js';
import assetsThemeSlice from '../slices/assetsThemeSlice.js';
const store = configureStore({
    reducer: {  
        theme:themeSlice,
        assetTheme:assetsThemeSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        })
});


export default store;