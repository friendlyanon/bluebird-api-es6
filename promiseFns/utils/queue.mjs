// Stripped down version of
// https://gist.github.com/friendlyanon/afd5a18811c540bc8bcf3f40560d4c74
class Queue {
  constructor() {
    this._clearThreshold = 16;
    this._offset = 0;
    this._list = [];
  }
  enqueue(item) { this._list.push(item); }
  dequeue() {
    const { _list } = this;
    if (!_list.length) return;
    const result = _list[this._offset];
    if (++this._offset >= _list.length) {
      this._list = [];
      this._offset = 0;
    }
    else {
      if (this._offset >= this._clearThreshold) {
        this._list = _list.slice(this._clearThreshold - 1);
        this._offset = 0;
      }
      // clear dequeued elements with 0 to retain the array's elements kind
      // attribute in best case scenarios:
      // PACKED_SMI_ELEMENTS or PACKED_DOUBLE_ELEMENTS
      else _list[this._offset - 1] = 0;
    }
    return result;
  }
  size() { return this._list.length - this._offset; }
}

export default Queue;
