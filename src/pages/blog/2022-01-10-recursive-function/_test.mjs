import fetch from "node-fetch";


const sites = [
    "https://mytoori.com",
    "https://bbc.co.uk",
    "https://news.ycombinator.com/",
]

const validateXFrameHeaders = function(siteName, headers) {
    // do some validation and return boolean
    const hasXFrameOptions = headers["X-Frame-options"];
    let msg;
    if (hasXFrameOptions && ["deny", "sameorigin"].includes(hasXFrameOptions.toLowerCase())) {
        msg = 'blocks iframe through x-frame-options'; 
    } else msg = "allows iframes"; 

    console.table({[siteName]: msg});
}

// recursive container function using closure
const fetchHeaders = function(sitesInput, actionInput) {
    let sites = sitesInput, action = actionInput;

    return async function recursiveLoop(i) {
        // stop the loop if the end has been reached
        if (!(sites && sites.length) || i >= sites.length) {
            console.log(`------------ \nFinished looping over ${sites.length} sites`);
            return;
        }

        // validation (this is very crude for the sake of the example)
        const data = await fetch(sites[i]);
        action(sites[i], data?.headers);
        
        // continue with the next iteration
        return await recursiveLoop(i += 1);
    }
}

// sites to loop over; action to take
const start = fetchHeaders(sites, validateXFrameHeaders);
(async () => await start(0))(); // starting point is 0