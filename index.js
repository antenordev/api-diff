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
let route = "/route";

(async () => {
    console.log("Route:", route);

    const responseOrigin = await apiOrigin.get(`${route}?_limit=10000`)
        .then((response) => response.data)
        .catch((error) => console.log("Exception Origin:", error));
    console.log("Data Origin:", responseOrigin.length);

    const responseTarget = await apiTarget.get(`${route}?_limit=10000`)
        .then((response) => response.data)
        .catch((error) => console.log("Exception Target:", error));
    console.log("Data Target:", responseTarget.length);

    const dataOrigin = responseOrigin.map((item) => item);
    const dataTarget = responseTarget.map((item) => item);

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
