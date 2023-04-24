import moment from "moment";

export const validateYaleEmail = (email) => {
	const regex = /^[^\s@]+@yale\.edu$/i;
	return regex.test(email);
};

export const validateRegInput = (firstName, lastName, password) => {
	if (firstName.length < 1) {
		return {
			valid: false,
			err: "First name must be at least 1 character long",
		};
	}
	if (lastName.length < 1) {
		return {
			valid: false,
			err: "Last name must be at least 1 character long",
		};
	}
	if (password.length < 5) {
		return {
			valid: false,
			err: "Password must be at least 5 characters long",
		};
	}
	return { valid: true };
};

export const validateDate = (date1, date2) => {
	const date1Time = date1.getTime();
	const date2Time = date2.getTime();

	if (date1Time >= date2Time) {
		return { valid: false, err: "Invalid start/end period" };
	}

	return { valid: true };
};

export const validateWithinOneWeek = (dateTime) => {
	const now = new Date();
	const oneWeekFromNow = now.getTime() + 7 * 24 * 60 * 60 * 1000;

	if (dateTime < now) {
		return { valid: false, err: "Meeting Date is in the past" };
	}

	if (dateTime.getTime() > oneWeekFromNow) {
		return { valid: false, err: "Meeting Date is not within one week" };
	}

	return { valid: true };
};
