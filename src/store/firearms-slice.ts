import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Firearm, Page } from "@/types"

interface FirearmsState {
  items: Firearm[]
  page: number
  size: number
  totalPages: number
  totalElements: number
}

const initialState: FirearmsState = {
  items: [],
  page: 0,
  size: 12,
  totalPages: 0,
  totalElements: 0,
}

const firearmsSlice = createSlice({
  name: "firearms",
  initialState,
  reducers: {
    setFirearmsPage(state, action: PayloadAction<Page<Firearm>>) {
      state.items = action.payload.items
      state.page = action.payload.page
      state.size = action.payload.size
      state.totalPages = action.payload.totalPages
      state.totalElements = action.payload.totalElements
    },
    clearFirearms(state) {
      state.items = []
      state.page = 0
      state.size = 12
      state.totalPages = 0
      state.totalElements = 0
    },
  },
})

export const { setFirearmsPage, clearFirearms } = firearmsSlice.actions
export const firearmsReducer = firearmsSlice.reducer
