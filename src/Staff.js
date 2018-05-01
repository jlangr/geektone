  // F ---
  // E
  // D ---
  // C
  // B ---
  // A
  // G ---
  // F
  // E ---
  // D
  // C (---)

export const verticalIndex = noteName => {
    switch(noteName) {
      case "F5": return 0;
      case "E5": return 1;
      case "D5": return 2;
      case "C5": return 3;
      case "B4": return 4;
      case "A4": return 5;
      case "G4": return 6;
      case "F4": return 7;
      case "E4": return 8;
      case "D4": return 9;
      case "C4": return 10;
      default: break;
    };
    return -1;
  };
