const { application } = require('express');
const {readDB, writeDB} = require('./db');

const sendJSON = (res, statusCode, payload) =>{
    res.writeHead(statusCode, {'Content-Type' : 'application/json'});
    res.end(JSON.stringify(payload));
};

const router = async (req, res) => {
    const method = req.method;
    const parsedUrl = new URL(req.url, `http://${req.headers.host ||'localhost'}`)
    const pathname = parsedUrl.pathname;
    const originalEnd =  res.end;
    res.end = function(...args){
        console.log(`[${new Date().toISOString()}] ${method} ${req.url} -> ${res.statusCode}`);
        originalEnd.apply(res, args);
    };

    try{
        const db = await readDB();

        
        if (method === 'GET' && pathname === '/books'){
            let books = db.books;
            const availableQuery = parsedUrl.searchParams.get('available');
            if ( availableQuery !== null ){
                const isAvailable = availableQuery ==='true';
                books = books.filter(b=>b.available === isAvailable);
            }
            
            return sendJSON(res, 200, { succes : true, count: books.length, data: books});

        }

        const bookIdMatch = pathname.match(/^\/books\/([0-9]+)$/);
    
        if (bookIdMatch) {
            const id = parseInt(bookIdMatch[1], 10);
            const bookIndex = db.books.findIndex(b => b.id === id);

            if (method === 'GET') {
                if (bookIndex !== -1) {
                    return sendJSON(res, 200, { success: true, data: db.books[bookIndex] });
                } 
                else {
                return sendJSON(res, 404, { success: false, error: "Livre introuvable" });
                }
            }

      
            if (method === 'DELETE') {
                if (bookIndex !== -1) {
                    db.books.splice(bookIndex, 1); 
                    await writeDB(db); 
                    return sendJSON(res, 200, { success: true, message: "Livre supprimé" });
                } 
                else {
                    return sendJSON(res, 404, { success: false, error: "Livre introuvable" });
                }
            }
        }


        if (method === 'POST' && pathname === '/books') {
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                try {
                    const newBookData = JSON.parse(body);
                    const { title, author, year } = newBookData;
          
                    if (!title || !author || !year) {
                        return sendJSON(res, 400, { success: false, error: "Les champs title, author et year sont requis" });
                    }

                    const newId = db.books.length > 0 ? Math.max(...db.books.map(b => b.id)) + 1 : 1;
                    const newBook = {
                        id: newId,
                        title,
                        author,
                        year,
                        available: true 
                    };

                    db.books.push(newBook);
                    await writeDB(db);
                    return sendJSON(res, 201, { success: true, data: newBook });
                } 
                catch (e) {
                    return sendJSON(res, 400, { success: false, error: "JSON invalide" });
                }
            });
      
            return; 
        }

        return sendJSON(res, 404, { success: false, error: "Route non trouvée" });

    } 
    catch (error) {
        console.error("Erreur serveur :", error);
        return sendJSON(res, 500, { success: false, error: "Erreur interne" });
    }
};

module.exports = router;
