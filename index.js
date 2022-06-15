/**
 *  IMPORTS
 */
require('dotenv').config()
var axios = require('axios');

/**
 * API CREATE BASE_URL
 */
const apiOrigin = axios.create({
    baseURL: process.env.API_ORIGIN
});

const apiTarget = axios.create({
    baseURL: process.env.API_TARGET
});

/**
 * UTIL MODULES
 */
Array.prototype.diff = function(a) {
        return this.filter(function(i) {
            return a.indexOf(i) < 0;
        }
    );
};

/**
 *  SCRIPT DIFF
 */
let route = process.argv.slice(2)[0].toString();

(async () => {
    // DISPLAY NAME ROUTE
    console.log("Route:", route);

    // ORIGIN REQUEST METHOD GET WITH PARAM LIMIT
    const responseOrigin = await apiOrigin.get(`/${route}?_limit=1000`)
        .then((response) => response.data)
        .catch((error) => console.log("Exception Origin:", error));
    console.log("Count Origin:", responseOrigin.length);

    // TARGET REQUEST METHOD GET WITH PARAM LIMIT
    const responseTarget = await apiTarget.get(`/${route}?_limit=1000`)
        .then((response) => response.data)
        .catch((error) => console.log("Exception Target:", error));
    console.log("Count Target:", responseTarget.length);

    // ARRAY MAP
    const dataOrigin = responseOrigin.map((item) => item);
    // console.log("Data Target:", dataOrigin);

    const dataTarget = responseTarget.map((item) => item);
    // console.log("Data Target:", dataTarget);

    // ARRAY DIFF
    const diff = dataOrigin.diff(dataTarget);
    console.log("Diff:", diff.length);

    // POST/UPDATE DIFF
    const request = diff.map((item) =>
        apiTarget
            .post(route, item)
            .then((response) => response.data)
            .catch((error) => console.log("Exception Origin:", error))
    );
    console.log("Request Target:", request);
})();
