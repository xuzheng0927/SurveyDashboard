var utils = function() {
	function equalArrays(array1, array2) {
		if (array1 == null || array2 == null) return false;

		if (array1.length != array2.length) {
			return false;
		}
		else {
			var isEqual = true;
			// var foundInA2;
			// for (var i1 = 0; i1 < array1.length; i1++){
			// 	foundInA2 = false;
			// 	for (var i2 = 0; i2 < array2.length; i2++){
			// 		if (array1[i1] == array2[i2]) {
			// 			foundInA2 = true;
			// 		}
			// 	}
			// 	isEqual = (isEqual & foundInA2);
			// }
			array1.forEach(function(el) {
				if (array2.indexOf(el) === -1) isEqual = false;
			})
			array2.forEach(function(el) {
				if (array1.indexOf(el) === -1 ) isEqual = false;
			})
			return isEqual;
		}
	}

	function containedInArray(element, arr){
		var contained = false;
		if (arr != null) {
			// for (var i=0; i<arr.length; i++) {
			// 	if (arr[i] == element) contained = true;
			// }
			if (arr.indexOf(element) !== -1) contained = true;
		}
		return contained;
	}

	function removeElement(element, arr){
		var newArray = new Array();
		if (arr != null) {
			for (var i=0; i<arr.length; i++){
				if (arr[i] != element) newArray[newArray.length]=arr[i];
			}
		}
		return newArray;
	}

	return {
		equalArrays: 		equalArrays,
		containedInArray: 	containedInArray,
		removeElement: 		removeElement
	}
}();