export class BookingInputError extends Error {}

export function validateBookingRequest(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new BookingInputError("Please provide the booking details.");
  if (typeof data.roomId !== "string" || !/^[a-f\d]{24}$/i.test(data.roomId)) throw new BookingInputError("Please select a valid room.");
  for (const [field, label] of [["guestName", "Guest name"], ["guestPhone", "Phone number"], ["guestEmail", "Email address"]]) {
    if (typeof data[field] !== "string" || !data[field].trim()) throw new BookingInputError(`${label} is required.`);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.guestEmail.trim())) throw new BookingInputError("Please enter a valid email address.");
  for (const field of ["checkInDate", "checkOutDate"]) {
    if (typeof data[field] !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data[field]) || !Number.isFinite(Date.parse(data[field])) || new Date(data[field]).toISOString().slice(0, 10) !== data[field]) {
      throw new BookingInputError("Please enter valid check-in and check-out dates.");
    }
  }
  if (Date.parse(data.checkOutDate) <= Date.parse(data.checkInDate)) throw new BookingInputError("Check-out must be after check-in.");
  if (!Number.isInteger(data.numberOfGuests) || data.numberOfGuests < 1) throw new BookingInputError("Please enter a valid number of guests.");
  if (data.specialRequests != null && typeof data.specialRequests !== "string") throw new BookingInputError("Special requests must be text.");
}

export function buildBooking(data, userId, room) {
  validateBookingRequest(data);
  if (data.numberOfGuests > room.capacity) throw new BookingInputError(`This room allows up to ${room.capacity} guests.`);
  if (!Number.isFinite(room.price) || room.price <= 0) throw new BookingInputError("This room's price is unavailable. Please choose another room.");
  const nights = (Date.parse(data.checkOutDate) - Date.parse(data.checkInDate)) / 86400000;
  return {
    userId,
    roomId: room._id,
    guestName: data.guestName.trim(),
    guestPhone: data.guestPhone.trim(),
    guestEmail: data.guestEmail.trim(),
    checkInDate: data.checkInDate,
    checkOutDate: data.checkOutDate,
    numberOfGuests: data.numberOfGuests,
    specialRequests: data.specialRequests?.trim() || "",
    totalAmount: nights * room.price,
  };
}
