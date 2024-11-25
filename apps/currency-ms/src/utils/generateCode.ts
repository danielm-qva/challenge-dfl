export class AvailabilityCode {
  private code = new Map();

  insert(code: string, availability = true) {
    this.code.set(code, availability);
  }

  update(code: string, availability: boolean) {
    if (this.code.has(code)) {
      this.code.set(code, availability);
    } else {
      throw new Error('Código no disponible.');
    }
  }

  get(code: string) {
    if (this.code.has(code)) {
      return this.code.get(code);
    } else {
      throw new Error('Código no disponible.');
    }
  }

  delete(code: string) {
    if (this.code.has(code)) {
      this.code.delete(code);
    } else {
      throw new Error('Código no disponible.');
    }
  }

  exists(code: string): boolean {
    return this.code.has(code);
  }

  getFirstAvailableCode() {
    for (const [key, value] of this.code.entries()) {
      if (!value) {
        return key;
      }
    }
    return null;
  }
}

export const fillZero = (code: number, lenTotal: number = 6) => {
  return Math.abs(code).toString().padStart(lenTotal, '0');
};
