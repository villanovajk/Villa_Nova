import React from "react";
import { Check } from "lucide-react";
import { bookingConfig } from "../config/images";

export default function RoomSelector({
  rooms = [],
  availableRooms = [],
  selectedRooms = [],
  onRoomSelect,
  limit = 1
}) {
  const limitReached = selectedRooms.length >= limit;

  const handleToggleRoom = (room) => {
    const isAlreadySelected = selectedRooms.some((r) => r.id === room.id);

    if (isAlreadySelected) {
      onRoomSelect(selectedRooms.filter((r) => r.id !== room.id));
    } else {
      if (selectedRooms.length < limit) {
        onRoomSelect([...selectedRooms, room]);
      } else {
        // If at limit, replace the first selected room
        if (limit === 1) {
          onRoomSelect([room]);
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-baseline">
        <label className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-semibold block">
          3. Select Room{limit > 1 ? "s" : ""}
        </label>
        <span className="text-[10px] text-luxury-lightGray tracking-widest uppercase">
          Selected: {selectedRooms.length} of {limit}
        </span>
      </div>

      {/* Every room in the villa is identical, so guests simply pick a count of rooms rather than a specific suite. */}
      <div className="grid grid-cols-3 gap-3">
        {rooms.map((room) => {
          const isSelected = selectedRooms.some((r) => r.id === room.id);
          const isAvailable = availableRooms.some((r) => r.id === room.id);
          const isDisabled = !isAvailable || (!isSelected && limitReached);

          return (
            <button
              key={room.id}
              type="button"
              disabled={isDisabled}
              onClick={() => handleToggleRoom(room)}
              className={`relative border p-4 flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                !isAvailable
                  ? "opacity-30 border-white/5 bg-white/[0.01] cursor-not-allowed"
                  : isSelected
                    ? "bg-luxury-gold/5 border-luxury-gold shadow-gold-glow cursor-pointer"
                    : "bg-white/[0.02] border-white/10 hover:border-luxury-gold/40 cursor-pointer"
              }`}
            >
              {isSelected && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-luxury-gold flex items-center justify-center text-luxury-black">
                  <Check size={10} strokeWidth={3} />
                </span>
              )}
              <span className="font-serif text-sm font-medium text-white">
                {room.name}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-luxury-lightGray">
                {isAvailable ? (isSelected ? "Selected" : "Available") : "Booked"}
              </span>
              <span className="text-[9px] text-luxury-gold/70 tracking-wide">
                {room.capacity} Guests (+{bookingConfig.rooms.extraCapacity} Extra)
              </span>
            </button>
          );
        })}
      </div>

      {limitReached && selectedRooms.length === limit && (
        <p className="text-[10px] text-luxury-gold/80 font-light italic text-right mt-1">
          Selection limit reached ({limit} room{limit > 1 ? "s" : ""}). Uncheck one to change.
        </p>
      )}
    </div>
  );
}
