import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    value : null
}

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {

    }
})

export default userSlice.reducer