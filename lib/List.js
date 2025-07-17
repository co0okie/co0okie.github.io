export default class List {
    head; tail; length;
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
    *[Symbol.iterator]() {
        for (let node = this.head; node; node = node.next) {
            yield node.value;
        }
    }
    push(...items) {
        for (const item of items) {
            this.tail = new Node(item, this.tail, null);
            if (this.head == null) this.head = this.tail;
            this.length++;
        }
        return this.length;
    }
    extract(begin, end) {
        let beginNode = this.head;
        let beginIndex = 0;

        if (begin) for (; beginNode && !begin(beginNode.value, beginIndex, this); 
            beginNode = beginNode.next, beginIndex++);
        let endNode = this.tail;
        let endIndex = this.length - 1;
        if (end) for (; endNode && !end(endNode.value, endIndex, this); endNode = endNode.prev, endIndex--) {
            if (endIndex < beginIndex) break;
        }
        if (endIndex < beginIndex) return new List();
        let newList = new List();
        newList.head = beginNode;
        newList.tail = endNode;
        newList.length = endIndex - beginIndex + 1;
        if (this.head === beginNode) this.head = endNode.next;
        if (this.tail === endNode) this.tail = beginNode.prev;
        this.length -= newList.length;
        if (beginNode.prev) beginNode.prev.next = endNode.next;
        if (endNode.next) endNode.next.prev = beginNode.prev;
        beginNode.prev = null;
        endNode.next = null;
        return newList;
    }
}

export class Node {
    value; next; prev;
    constructor(value, prev = null, next = null) {
        this.value = value;
        this.prev = prev;
        this.next = next;
        if (prev) prev.next = this;
        if (next) next.prev = this;
    }
}