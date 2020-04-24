
class Engineer {

    constructor(engineer) {
        this.id = engineer.id;
        this.name = engineer.name;
        this.supportDate = engineer.supportDate;
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setSupportDate(supportDate) {
        this.supportDate = supportDate;
    }

    getSupportDate() {
        return this.supportDate;
    }

    addSupportDate(date) {
        this.supportDate.push(date);
    }

    resetSupportDate() {
        this.supportDate = [];
    }
}

module.exports = Engineer;