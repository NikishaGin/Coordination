

export const thunkGetDocuments = async (type, { rejectWithValue, getState }) => {
    try {
        // const response = await fileStorageAPI.getDocuments(source)
        // return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return rejectWithValue(error.message);
    }
};


export const thunkSaveDocument = async ({ type, filename, file }, { rejectWithValue, getState }) => {
    try {

        /*
        const formData = new FormData();
        formData.append('name', name)
        formData.append('file', file)
        const response = await fileStorageAPI.saveDocument(source, formData);
        return response.data;
         */

    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return rejectWithValue(error.message);
    }
}
