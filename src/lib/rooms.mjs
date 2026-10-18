export function roomName(room) {
  return room.name || (room.roomType === "Suite" || room.roomType === "Presidential"
    ? `${room.roomType} Suite` : `${room.roomType || "Guest"} Room`)
}

export function roomPrice(price) {
  return `PKR ${new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(Number(price) || 0)}`
}

export function selectRooms(rooms, type = "All", order = "recommended") {
  const selected = rooms.filter(room => room.isAvailable && (type === "All" || room.roomType === type))
  return selected.sort((a, b) => order === "price-low" ? a.price - b.price
    : order === "price-high" ? b.price - a.price
    : String(a.roomNumber).localeCompare(String(b.roomNumber), undefined, { numeric: true }))
}
