/* eslint-disable no-restricted-globals */
self.onmessage = async (event) => {
	if (event && event.data) {
		const { ratings, length } = event.data;
		combinationsWithRepetition(ratings, length);
		self.postMessage({ status: "DONE", combination: [] });
	}

	//https://stackoverflow.com/a/32544026
	function combinationsWithRepetition(arr, l) {
		if (l === void 0) l = arr.length; // Length of the combinations
		const data = Array(l); // Used to store stat
		const results = []; // Array of results
		(function f(pos, start) {
			// Recursive function
			if (pos === l) {
				// End reached
				results.push(data.slice()); // Add a copy of data to results
				return;
			}
			for (var i = start; i < arr.length; ++i) {
				data[pos] = arr[i]; // Update data
				f(pos + 1, i); // Call f recursively
			}
			self.postMessage({ status: "COMBINATION", combination: data });
		})(0, 0); // Start at index 0
		return results;
	}
};

//TODO check this: https://stackoverflow.com/a/48950463
