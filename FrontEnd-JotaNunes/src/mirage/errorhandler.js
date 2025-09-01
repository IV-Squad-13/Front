export const handleError = (message, status) => {
    let error = new Error(message);
    error.status = status;
    throw error;
}