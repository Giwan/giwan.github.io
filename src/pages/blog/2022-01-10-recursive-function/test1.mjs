const recursiveLoop = function(i = 0, arr) {
    if (!(arr && arr.length) || i >= arr.length) return;

    console.log(arr[i]); 
    return recursiveLoop(i += 1, arr);
}

recursiveLoop(0, [1,2,3,4]);