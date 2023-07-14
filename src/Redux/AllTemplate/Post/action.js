export const addData = (data) => ({
  type: 'ADD_DATA',
  payload: data
});

export const updateData = (data) => ({
  type: 'UPDATE_DATA',
  payload: data
});

export const deleteData = (id) => ({
  type: 'DELETE_DATA',
  payload: { id }
});
