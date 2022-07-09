const fs = require('fs');

class Contenedor {
    constructor(nombreArchivo) {
        this.arch = nombreArchivo;
        this.ruta = this.arch;
        this.backup = [  {
            "title": "Superliminal",    
            "price": 185.61,
            "thumbnail": "https://store.steampowered.com/app/1049410/Superliminal/",
            "id": 1
          },
          {
            "title": "The Stanley Parable: Ultra Deluxe",
            "price": 161.99,
            "thumbnail": "https://store.steampowered.com/app/1703340/The_Stanley_Parable_Ultra_Deluxe/",
            "id": 2
          },
          {
            "title": "UnMetal",
            "price": 1324.13,
            "thumbnail": "https://store.steampowered.com/app/1203710/UnMetal/",
            "id": 3
          },
          {
            "title": "Satisfactory",
            "price": 1648.35,
            "thumbnail": "https://store.steampowered.com/app/526870/Satisfactory/",
            "id": 4
          },
          {
            "title": "NieR:Automata",
            "price": 1072.49,
            "thumbnail": "https://store.steampowered.com/app/524220/NieRAutomata/",
            "id": 5
          }];
    }

    async getAll() {
        try {
            const contenido = await fs.promises.readFile(this.ruta, 'utf-8');
            return JSON.parse(contenido);
        }
        catch (error) {
            console.log(`El archivo no existe, se va a pasar a la creación del mismo | Nombre del Archivo: ${this.arch}`);
            await fs.promises.writeFile(this.ruta, JSON.stringify(this.backup, null, 2));
            const contenido = await fs.promises.readFile(this.ruta, 'utf-8');
            return JSON.parse(contenido);
        }
    }

    async save(elemento) {
        try {
            if (!(await this.objetoRepetido(elemento))) {
                elemento.id = await this.nuevoID();
                const arr = await this.getAll();
                arr.push(elemento);
                await fs.promises.writeFile(this.ruta, JSON.stringify(arr, null, 2));
                return elemento.id;
            } else {
                elemento = { error: 'Este elemento ya existe' };
                return elemento;
            }
        }
        catch (error) {
            console.log("No se pudo agregar el objeto al archivo.");
            return null;
        }
    }

    async update(elemento) {
        let arr = await this.getAll();        
        try {
            const index = arr.findIndex((el) => (parseInt(el.id) === parseInt(elemento.id)));
            console.log(elemento);
            if (index >= 0) {
                arr[index] = elemento;
                await fs.promises.writeFile(this.ruta, JSON.stringify(arr, null, 2));
                return elemento.id;
            }
            else {
                elemento = { error: 'El ID no existe' };
                return elemento;
            }
        } catch (err) {
            console.log("No se pudo actualizar el objeto al archivo.");
            return null;
        }
    }

    async nuevoID() {
        let maximo = 0;
        const arr = await this.getAll();
        arr.forEach(el => {
            if (parseInt(el.id) > maximo) {
                maximo = parseInt(el.id);
            }
        })
        maximo++;
        return maximo;
    }

    async objetoRepetido(elemento) {
        const arr = await this.getAll();
        let repetido = false;
        arr.forEach(el => {
            if (el.title == elemento.title && el.price == elemento.price && el.thumbnail == elemento.thumbnail) {
                repetido = true;
            }
        })
        return repetido;
    }

    async getById(id) {
        try {
            const arr = await this.getAll();
            const elemento = arr.find(el => (parseInt(el.id) === parseInt(id)));
            if (elemento == undefined) {
                elemento = { error: 'producto no encontrado' };
            }
            return elemento || null;
        }
        catch (error) {            
            return { error: 'producto no encontrado' };
        }
    }

    async deleteById(id) {
        let encontrado = false;
        let i = 0;

        try {
            const arr = await this.getAll();
            while (!encontrado && i < arr.length) {
                if (parseInt(arr[i].id) === parseInt(id)) {
                    const eliminado = arr.splice(i, 1);
                    console.log(arr);
                    await fs.promises.writeFile(this.ruta, JSON.stringify(arr, null, 2));
                    console.log("Se eliminó el registro.");
                    console.log(eliminado);
                    encontrado = true;
                    return eliminado;
                } else {
                    i++;
                }
            }
            if (!encontrado) {
                console.log(`No existe el ID que se quizo eliminar(${id}).`);
                return { 'No existe ese registro': id }
            }
        }
        catch (error) {
            console.log("No existe el ID que se quizo eliminar.");
            return { 'No se pudo eliminar el registro': id }
        }
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.ruta, JSON.stringify([], null, 2));
            console.log("Todos los registros fueron eliminados.");
        }
        catch (error) {
            console.log("No se pudo eliminar los registros.");
        }
    }

    async deleteFile() {
        try {
            await fs.promises.unlink(this.ruta);
            console.log("Archivo Eliminado");
        }
        catch (error) {
            console.log("No se pudo eliinar el archivo.");
        }
    }
}

module.exports = Contenedor;