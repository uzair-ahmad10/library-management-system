export const calculateFine = (dueDate) => {
  const finePerHour = 0.1; // 10 cents
  const today = new Date();

  // If today's date is past the due date
  if (today > dueDate) {
    // Calculate the difference in milliseconds and convert to hours (rounded up)
    const lateHours = Math.ceil(
      (today - dueDate) / (1000 * 60 * 60)
    );
    
    const fine = lateHours * finePerHour;
    return fine;
  }

  // If returned on time, fine is 0
  return 0;
};