import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    bulb: false,
    tubelight: false,
    noticeBoardLight: false
}

const themeSlice = createSlice({
    name: "assetTheme",
    initialState,
    reducers: {
        setBulb: (state, action) => {
            state.bulb = true;
        },
        setTubeLight: (state, action) => {
            state.tubelight = true;
        },
        setNoticeBoardLight: (state, action) => {
            state.noticeBoardLight = true;
        },
        unsetAssetTheme: (state, action) => {
            state.bulb = false;
            state.tubelight = false;
            state.noticeBoardLight = false;
        }
    }
})

export const { setBulb,setTubeLight,setNoticeBoardLight,unsetAssetTheme } = themeSlice.actions;

export default themeSlice.reducer;