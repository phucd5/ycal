export const getTermString = (termCode) => {
	const term =
		termCode.slice(-2) === "01"
			? "Spring"
			: termCode.slice(-2) === "02"
			? "Summer"
			: termCode.slice(-2) === "03"
			? "Fall"
			: "Invalid Term Code";
	const year = termCode.slice(0, 4);
	return `${term} ${year}`;
};
