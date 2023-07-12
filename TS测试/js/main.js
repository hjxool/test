class Phone {
    constructor(name) {
        this.name = name;
    }
    fn() {
        return;
    }
}
class smartPhone extends Phone {
    constructor(name, color) {
        super(name);
        this.color = color;
    }
    fn() {
        console.log('重写');
    }
}
