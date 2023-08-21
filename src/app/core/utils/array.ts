declare global {
    interface Array<T> {
        shuffle(): Array<T>;
        shuffled(): Array<T>;
        zip<U>(other: U[]): Array<[T, U]>;
    }
}

Array.prototype.shuffle = function <T>(this: T[]): typeof this {
    let curr = this.length;
    let rnd: number;

    while (curr !== 0) {
        rnd = Math.floor(Math.random() * curr);
        curr--;

        [this[curr], this[rnd]] = [this[rnd], this[curr]];
    }

    return this;
};

Array.prototype.shuffled = function <T>(this: T[]): typeof this {
    return this.slice().shuffle();
};

Array.prototype.zip = function <T, U>(this: T[], other: U[]): Array<[T, U]> {
    return this.map((x, i) => [x, other[i]]);
};

export {};
