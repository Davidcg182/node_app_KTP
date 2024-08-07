import app from './app.js';
import { sequelize } from './config/database.js';

const PORT = process.env.PORT || 3001;

async function main() {
    try {
        await sequelize.sync({force: false})
        await sequelize.authenticate()
        console.log('Conexión exitosa a la base de datos');
        app.listen(PORT, console.log(`escuchando puerto ${PORT}`));
    } catch (error) {
        console.error('Error al conectarse a la base de datos:', error);
    }
}

main();