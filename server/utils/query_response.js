export const handleSuccess = (res, data) => {
  return res.status(200).json(data);
};

export const handleNotFound = (res) => {
  return res.status(404).json({ message: "User not found" });
};

export const handleServerError = (res, err) => {
  return res.status(404).json({ message: err.message });
};
