function equalArrays(array1, array2) {
	if (array1.length != array2.length) {
		return false;
	}
	else {
		var isEqual = true;
		for (var i = 0; i < array1.length; i++){
			if (array1[i] != array2[i]) {
				isEqual = false;
			}
		}
		return isEqual;
	}
}

function disableOptionWithValue(selectDOM,opt_val){
	for (i = 0; i < selectDOM.children().length; i++){
		if (selectDOM.children()[i].value == opt_val) {
			selectDOM.children().children()[i].setAttribute("disabled","disabled")
		}
	}
}