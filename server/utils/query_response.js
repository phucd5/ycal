export const handleSuccess = (res, data) => {
	return res.status(200).json(data);
};

export const handleNotFound = (res, message) => {
	return res.status(404).json({ message: message });
};

export const handleBadRequest = (res, message) => {
	return res.status(400).json({ message: message });
};

export const handleServerError = (res, err) => {
	return res.status(404).json({ message: err.message });
};
