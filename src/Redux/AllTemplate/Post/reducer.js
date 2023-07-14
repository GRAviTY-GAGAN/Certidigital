const initialState = {
  data: []
};

export const postDatareducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_DATA':
      return {
        ...state,
        data: [...state.data, action.payload]
      };
    case 'UPDATE_DATA':
      const updatedData = state.data.map((item) => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            name: action.payload.name,
            imageUrl: action.payload.imageUrl
          };
        }
        return item;
      });
      return {
        ...state,
        data: updatedData
      };
    case 'DELETE_DATA':
      const filteredData = state.data.filter((item) => item.id !== action.payload.id);
      return {
        ...state,
        data: filteredData
      };
    default:
      return state;
  }
};
  
