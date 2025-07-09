import React, { useEffect, useRef } from 'react';
import type { SeatMap as SeatMapType } from '../types';

interface SeatMapProps {
  seatMap: SeatMapType;
  selectedSeat: string | null;
  onSeatClick: (seatCode: string) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ seatMap, selectedSeat, onSeatClick }) => {
  const numRows = seatMap.seat_status.length;
  const numCols = seatMap.seat_labels.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const scalerRef = useRef<HTMLDivElement>(null);

  // Build grid template for CSS Grid
  const gridTemplateRows = `40px repeat(${numRows}, 1fr)`; // 40px for header, rest fill
  const gridTemplateCols = `50px repeat(${numCols}, 1fr)`; // 50px for row numbers, rest fill

  useEffect(() => {
    function resizeScaler() {
      const container = containerRef.current;
      const scaler = scalerRef.current;
      if (!container || !scaler) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const scalerWidth = scaler.scrollWidth;
      const scalerHeight = scaler.scrollHeight;

      const scale = Math.min(
        containerWidth / scalerWidth,
        containerHeight / scalerHeight,
        1 // Never upscale, only downscale
      );

      scaler.style.setProperty('--seat-map-scale', scale.toString());
    }
    resizeScaler();
    window.addEventListener('resize', resizeScaler);
    return () => window.removeEventListener('resize', resizeScaler);
  }, [seatMap]);

  return (
    <div className="seat-map-container">
      <div className="seat-map-header">
        <h3> Flight Seat Map</h3>
        <p>Click on available seats to select them for booking</p>
      </div>
      <div className="compact-seat-map" ref={containerRef}>
        <div className="seat-map-scaler" ref={scalerRef}>
          <div
            className="grid-seat-map"
            style={{
              display: 'grid',
              gridTemplateRows,
              gridTemplateColumns: gridTemplateCols,
            }}
          >
            {/* Top-left empty cell */}
            <div className="seat-header seat-corner"></div>
            {/* Column headers */}
            {seatMap.seat_labels.map((label) => (
              <div key={label} className="seat-header">{label}</div>
            ))}
            {/* Seat rows */}
            {seatMap.seat_status.map((row, rowIndex) => [
              // Row number
              <div key={`rownum-${rowIndex}`} className="row-number">{String(rowIndex + 1).padStart(2, '0')}</div>,
              // Seats
              ...row.map((seat) => (
                <div
                  key={seat.seat_code}
                  className={`compact-seat ${
                    seat.is_booked
                      ? 'booked'
                      : selectedSeat === seat.seat_code
                      ? 'selected'
                      : 'available'
                  }`}
                  onClick={() => !seat.is_booked && onSeatClick(seat.seat_code)}
                  title={seat.is_booked ? 'Booked' : seat.seat_code}
                >
                  {seat.is_booked ? '✕' : seat.seat_code.slice(-1)}
                </div>
              )),
            ])}
          </div>
        </div>
      </div>
      {/* Legend */}
      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-seat available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-seat selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-seat booked"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap; 