interface Product {
    id: number;
    name: string;
    price: number;
}

class Author {
    id: number;
    name: string;
    age: number;

    constructor(id: number, name: string, age: number) {
        this.id = id;
        this.name = name;
        this.age = age;
    }

    getInfo(): string {
        return `${this.name} (${this.age} tuổi)`;
    }
}

class Book implements Product {
    id: number;
    name: string;
    price: number;
    author: Author;

    constructor(id: number, name: string, price: number, author: Author) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.author = author;
    }

    toString(): void {
        console.log("Book: "
            + "\n id: " + this.id
            + "\n name: " + this.name
            + "\n price: " + this.price
            + "\n author: " + this.author.getInfo()
        );
    }
}


let a = new Author(1, "Duc Manh", 21)
let b = new Book(1, "nune", 40000, a)

b.toString()