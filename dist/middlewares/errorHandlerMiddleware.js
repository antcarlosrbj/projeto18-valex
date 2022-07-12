export default function errorHandler(error, req, res, next) {
    console.log(error);
    if (error.response) {
        return res.sendStatus(error.response.status);
    }
    res.sendStatus(500); // internal server error
}
