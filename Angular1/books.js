var Author = /** @class */ (function () {
    function Author(id, name, age) {
        this.id = id;
        this.name = name;
        this.age = age;
    }
    Author.prototype.getInfo = function () {
        return "".concat(this.name, " (").concat(this.age, " tu\u1ED5i)");
    };
    return Author;
}());
var Book = /** @class */ (function () {
    function Book(id, name, price, author) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.author = author;
    }
    Book.prototype.toString = function () {
        console.log("Book: "
            + "\n id: " + this.id
            + "\n name: " + this.name
            + "\n price: " + this.price
            + "\n author: " + this.author.getInfo());
    };
    return Book;
}());
var a = new Author(1, "Duc Manh", 21);
var b = new Book(1, "nune", 40000, a);
b.toString();
