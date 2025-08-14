import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import api from "../../api/axios.js"
import {toast} from "react-hot-toast"

const initialState = {
    value : null
}

/*
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Divyanshu"
  }
}
*/
 
//!createAsyncThunk is used to handle async functions ('function ka name',async function () {})
//! inka alag reducer banana

export const fetchUser = createAsyncThunk('user/fetchUser', async(token)=>{
    const {data} = await api.get('/api/user/data', {
        headers : {Authorization : `Bearer ${token}`}
    })
    return data.success ? data.user : null
})

export const updateUser = createAsyncThunk('user/update', async(token)=>{
    const {data} = await api.get('/api/user/update', {
        headers : {Authorization : `Bearer ${token}`}
    })
    if(data.success){
       toast.success(data.message)
       return data.user 
    }else{
        toast.error(data.message)
        return null
    }
})

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {

    },
    extraReducers : (builder) => {
        builder.addCase(fetchUser.fulfilled, (state, action)=>{
            state.value = action.payload
        }).addCase(updateUser.fulfilled, (state, action)=>{
            state.value = action.payload
        })
    }
})

export default userSlice.reducer