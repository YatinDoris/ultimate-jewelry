// import { createSlice } from "@reduxjs/toolkit";
// const initialState = {
//     selectedCaratWeight: null
// };

// const selectedDiamondSlice = createSlice({
//     name: "selectedDiamond",
//     initialState,
//     reducers: {
//         setSelectedCaratWeight(state, action) {
//             state.selectedCaratWeight = action.payload;
//         },
//     },
// });

// export const {
//     setSelectedCaratWeight,
// } = selectedDiamondSlice.actions;

// export default selectedDiamondSlice.reducer;

// store/slices/selectDiamondSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     selectedDiamondShape: null,
//     selectedCaratWeight: null,
//     selectedDiamondClarity: null,
//     selectedDiamondColor: null,
// };

// const selectDiamondSlice = createSlice({
//     name: "selectedDiamond",
//     initialState,
//     reducers: {
//         setSelectedDiamondShape: (state, action) => {
//             state.selectedDiamondShape = action.payload;
//         },
//         setSelectedCaratWeight: (state, action) => {
//             state.selectedCaratWeight = action.payload;
//         },
//         setSelectedDiamondClarity: (state, action) => {
//             state.selectedDiamondClarity = action.payload;
//         },
//         setSelectedDiamondColor: (state, action) => {
//             state.selectedDiamondColor = action.payload;
//         },
//         resetDiamondSelections: (state) => {
//             return initialState;
//         },
//     },
// });

// export const {
//     setSelectedDiamondShape,
//     setSelectedCaratWeight,
//     setSelectedDiamondClarity,
//     setSelectedDiamondColor,
//     resetDiamondSelections,
// } = selectDiamondSlice.actions;

// export default selectDiamondSlice.reducer;

// store/slices/selectDiamondSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    diamondSelection: {
        shape: null,
        caratWeight: null,
        clarity: null,
        color: null
    }
};

const selectDiamondSlice = createSlice({
    name: "selectedDiamond",
    initialState,
    reducers: {
        setDiamondSelection: (state, action) => {
            state.diamondSelection = {
                ...state.diamondSelection,
                ...action.payload
            };
        },
        resetDiamondSelection: (state) => {
            state.diamondSelection = initialState.diamondSelection;
        }
    }
});

export const {
    setDiamondSelection,
    resetDiamondSelection
} = selectDiamondSlice.actions;

export default selectDiamondSlice.reducer;