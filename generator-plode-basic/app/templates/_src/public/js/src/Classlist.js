export default class ClassList {
    constructor(el) {
        this.el = el;
        this.list = el.className.trim().split(' ');
    }

    contains(name) {
        return this.list.indexOf(name) > -1;
    }

    remove(name) {
        this.list.splice(this.list.indexOf(name), 1);
        this.el.className = this.list.join(' ').trim();
        return this;
    }

    add(name) {
        this.list.push(name);
        this.el.className = this.el.className.concat(' ', name).trim();
        return this;
    }
}
