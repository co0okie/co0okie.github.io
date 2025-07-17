export declare class List<T = unknown> {
    head: Node<T> | null;
    tail: Node<T> | null;
    length: number;
    constructor();
    [Symbol.iterator](): Generator<T, void, unknown>;
    push(...items: T[]): number;
    extract(begin?: (value: T, index: number, list: List<T>) => boolean, end?: (value: T, index: number, list: List<T>) => boolean): List<T>;
}

export declare class Node<T = unknown> {
    value: T;
    next?: Node<T> | null;
    prev?: Node<T> | null;
    constructor(value: T, prev?: Node<T> | null, next?: Node<T> | null);
}

export default List;