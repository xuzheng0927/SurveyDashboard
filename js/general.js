function equalArrays(array1, array2) {
	if (array1.length != array2.length) {
		return false;
	}
	else {
		var isEqual = true;
		for (var i1 = 0; i1 < array1.length; i1++){
			isEqual = false;
			for (var i2 = 0; i2 < array2.length; i2++){
				if (array1[i1] == array2[i2]) {
					isEqual = true;
				}
			}
			/*if (array1[i] != array2[i]) {
				isEqual = false;
			}*/
		}

		/*for (var i2 = 0; i2 < array2.length; i2++){
			isEqual = false;
			for (var i1 = 0; i1 < array1.length; i1++){
				if (array1[i1] == array2[i2]) {
					isEqual = true;
				}
			}
		}*/
		return isEqual;
	}
}

function containedInArray(element, arr){
	var contained = false;
	if (arr != null) {
		for (var i=0; i<arr.length; i++) {
			if (arr[i] == element) contained = true;
		}
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

