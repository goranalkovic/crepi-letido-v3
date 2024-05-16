export const getCurrentDate = () => {
	// const date = new Date();
	// const currentYear = date.getFullYear();
	// const currentDay = date.getDate().toString().padStart(2, '0');
	// const currentMonth = (date.getMonth() + 1).toString().padStart(2, '0');
	// return `${currentYear}-${currentMonth}-${currentDay}`;

	return new Date().toISOString().slice(0, 10);
};