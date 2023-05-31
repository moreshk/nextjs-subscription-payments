
export const getFormateTime = (time: string) => {

 const existingTime = new Date(time);

 const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

 // Define an array of abbreviated month names
 const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

 // Extract the day of the week, day of the month, month, hour, and minutes
 const dayOfWeek = daysOfWeek[existingTime.getDay()];
 const dayOfMonth = existingTime.getDate();
 const month = months[existingTime.getMonth()];
 const hour = existingTime.getHours();
 const minutes = existingTime.getMinutes();

 // Determine whether it's AM or PM
 const period = hour >= 12 ? "PM" : "AM";

 // Adjust the hour to 12-hour format
 const formattedHour = hour % 12 || 12;

 // Pad the minutes with a leading zero if necessary
 const formattedMinutes = minutes.toString().padStart(2, "0");

 // Create the formatted date and time string
 const formattedDateTime = `${dayOfWeek} ${dayOfMonth} ${month} ${formattedHour}.${formattedMinutes}:${period}`;


 // Format the date and time
 return formattedDateTime
}
