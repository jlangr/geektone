export default class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  contains(number) {
    return number >= this.start && number <= this.end;
  }
}