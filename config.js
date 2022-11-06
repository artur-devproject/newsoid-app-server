module.exports = {
    PORT: 5000,
    DB_HOST: "mongodb://localhost:27017/news",
    LOADING_TIME: '15 * * * *',
    REMOVING_TIME: '45 * * * *',
    STORING_DAYS: 5,
    LIMIT_REQUEST: 30,
}