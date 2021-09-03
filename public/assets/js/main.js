var app = new Vue({
    el: '#app',
    data: {
      searchedBook:"",
      searchedAuthor:"",
      searchedGenre:"",
      searchedYear:"",
      authors:[],
      genres:[],
      years:[],
      books:[],
      loading:false,
      numberOfBooksFound:0
    },
    methods:{
        async searchBook(){
            try{
                this.books=[];
                this.loading = true;
                var books = [];
                //get books by title
                const Books = Parse.Object.extend("books");
                const Authors = Parse.Object.extend("authors");
    
                
                if(this.searchedBook != ''){
                    var results1 =await new Parse.Query(Books).matches("title", this.searchedBook, 'i').find();
                    results1.forEach(book => {
                        books.push(book);
                    });

                    //search book by ISBN
                    var results5 =await new Parse.Query(Books).matches("ISBN", this.searchedBook, 'i').find();
                    results5.forEach(book => {
                        var bookId = book.id;
                        const foundIndex = books.findIndex(oldbook => oldbook.id === bookId);
                        if(foundIndex < 0){
                            books.push(book);
                        }
                    });
                }

                //get books by author name
                var results2 =await new Parse.Query(Books).equalTo("author", this.searchedAuthor).find();
    
                // add book to books if not in books array
                results2.forEach(book => {
                    var bookId = book.id;
                    const foundIndex = books.findIndex(oldbook => oldbook.id === bookId);
                    if(foundIndex < 0){
                        books.push(book);
                    }
                });
                
                // get books by genre
                var results3 =await new Parse.Query(Books).equalTo("genre", this.searchedGenre).find();
                 // add book to books if not in books array
                results3.forEach(book => {
                    var bookId = book.id;
                    const foundIndex = books.findIndex(oldbook => oldbook.id === bookId);
                    if(foundIndex < 0){
                        books.push(book);
                    }
                });
                
                // get books by year
                var results4 =await new Parse.Query(Books).equalTo("year", this.searchedYear.toString()).find();
                  // add book to books if not in books array
                results4.forEach(book => {
                    var bookId = book.id;
                    const foundIndex = books.findIndex(oldbook => oldbook.id === bookId);
                    if(foundIndex < 0){
                        books.push(book);
                    }
                });
    
               //create a new array and push the books from parse object to it
                var newBooks = [];
                for (let index = 0; index < books.length; index++) {
                    const book = books[index];
                    var author =await new Parse.Query(Authors).equalTo("objectId",book.get('author')).find();
                    var newBook = {
                        title:book.get('title'),
                        image:book.get('image'),
                        year:book.get('year'),
                        genre:book.get('genre'),
                        ISBN:book.get('ISBN'),
                        author:author[0].get('name'),
                    };
                    newBooks.push(newBook);
                }
                this.books = newBooks;
                this.loading = false;
                this.numberOfBooksFound =  newBooks.length;
            }catch(e){
                alert('Oops an error occured please try again later');
            }finally{
                this.loading = false;
            }
        }
    },
    mounted: async function() {

         //initialize parse
         Parse.initialize("a9e8a45c429dfd68ec1dd9bc905d50a7", null,"014c5ef61e2e51b8b1272e342fbf7821de08193b");
         Parse.serverURL = 'http://localhost:1337/parse';

         
         //get years
         var endYear = new Date().getFullYear();
         var years = [];
         for(var i=2000; i<endYear; i++){
             years.push(i);
         }
         this.years = years;

        try{
            //get genres using parse sdk
            var genres = [];
            const Books = Parse.Object.extend("books");
            const query = new Parse.Query(Books);
            var results =await query.find()
            results.forEach(book => {
                if(genres.indexOf(book.get('genre')) < 0){
                    genres.push(book.get("genre"));
                }
            });
            this.genres = genres ;
        }catch(e){
            console.log(e);
        }

        try{
            //get authors using parse sdk
            var authors = [];
            const Authors = Parse.Object.extend("authors");
            const query = new Parse.Query(Authors);
            var results =await query.find()
            results.forEach(book => {
                authors.push({name:book.get("name"), id: book.id});
            });
            this.authors = authors ;
        }catch(e){
            console.log(e);
        }

    }
  })