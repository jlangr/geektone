Object.defineProperty(Array.prototype, 'next', {
    value: function(i) {
      if (i < 0 || i >= this.length) return -1;
      return i === this.length - 1? 0 : i + 1;
  }
});
Object.defineProperty(Array.prototype, 'prev', {
    value: function(i) {
      if (i < 0 || i >= this.length) return -1;
      return i === 0 ? this.length - 1 : i - 1;
  }
});
