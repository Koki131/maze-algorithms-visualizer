
class MinHeap {
    constructor() {
        this.heap = [];
        this.n = 0;
    }
    
    insert(value) {
    
        this.n++;
        this.heap[this.n] = value;
        this.swim(this.n);
    
    }
    
    swim(k) {
        
        const parent = Math.round(k / 2);
    
        while (k > 1 && this.heap[parent].weight > this.heap[k].weight) {
    
        this.swap(k, parent);
        k = Math.round(k / 2);
    
        }
    
    }
    
    delete() {
    
        const val = this.heap[1];
        this.swap(1, this.n);
        this.n--;
        this.sink(1);
        this.heap[this.n + 1] = undefined;
    
    
        return val;
    
    }
    
    sink(k) {
    
        while (k * 2 <= this.n) {
    
        let j = k * 2;
    
        if (j < this.n && this.heap[j].weight > this.heap[j + 1].weight) {
            j++;
        }
    
        if (this.heap[k].weight < this.heap[j].weight) {
            break;
        }
    
        this.swap(k, j);
        k = j;
    
        }
    
    }
    
    swap(k, j) {
        let temp = this.heap[k];
        this.heap[k] = this.heap[j];
        this.heap[j] = temp;
    } 
    
    isEmpty() {
        return this.n === 0;
    }
    
}
    
class CustomHeap {
    constructor() {
        this.heap = [];
        this.n = 0;
    }
    
    insert(value) {
        this.n++;
        this.heap[this.n] = value;
        this.swim(this.n);
    }
    
    swim(k) {
        let parent = Math.floor(k / 2);
    
        while (k > 1 && this.shouldSwap(parent, k)) {
        this.swap(k, parent);
        k = parent;
        parent = Math.floor(k / 2);
        }
    }
    
    delete() {
        const val = this.heap[1];
        this.swap(1, this.n);
        this.n--;
        this.sink(1);
        this.heap[this.n + 1] = undefined;
        return val;
    }
    
    sink(k) {
    
        while (k * 2 <= this.n) {
        let j = k * 2;
    
        if (j < this.n && this.shouldSwap(j, j + 1)) {
            j++;
        }
    
        if (this.heap[k] < this.heap[j]) {
            break;
        }
    
        this.swap(k, j);
        k = j;
        }
    }
    
    shouldSwap(i, j) {
        if (
        this.heap[i].fScore > this.heap[j].fScore ||
        (this.heap[i].fScore === this.heap[j].fScore &&
            this.heap[i].distance > this.heap[j].distance)
        ) {
        return true;
        }
        return false;
    }
    
    swap(k, j) {
        let temp = this.heap[k];
        this.heap[k] = this.heap[j];
        this.heap[j] = temp;
    }
    
    isEmpty() {
        return this.n === 0;
    }
}

export { MinHeap, CustomHeap };