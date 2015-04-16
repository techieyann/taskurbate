parseFormData = function (formData) {
	var parsedData = {};
	for(var i in formData) {
		parsedData[formData[i].name] = formData[i].value;
	}
	return parsedData;
};
