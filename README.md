INSTRUCCIONES PARA TESTEAR LA APP

1. CLONAR EL REPOSITORIO (ASEGURARSE DE INCLUIR EL ARCHIVO .env EL CUAL TIENE LAS VARIABLES DE ENTORNO CONFIGURADAS PARA TESTEAR RAPIDAMENTE LA APP)
2. NO SE PREOCUPE POR LAS VARIABLES DE ENTORNO DE LA BASE DE DATOS, ESTAS SON DE UNA BASE DE DATOS DE PRUEBA DESPLEGADA EN RENDER Y DEBE FUNCIONAR
3. EN LA RAIZ DE SU PROYECTO (DONDE CLONO EL REPOSITORIO) EJECUTAR EL COMANDO "docker build . -t node-app:latest"
4. LUEGO EJECUTE EL COMANDO "docker run --env-file=./.env -p 9000:9000  node-app:latest"
5. FINALMENTE EJECUTE LAS SIGUIENTES RUTAS (END POINTS) PARA TESTEAR LA APP

NOTA:
- LAS VARIABLES DE ENTORNO COMPARTIDAS SON UNICAMENTE CON EL FIN DE PROBAR LA APP SUMINISTRADA, NO ES RECOMENDABLE COMPARTIR BAJO NINGUN MOTIVO ESTE TIPO DE VARIABLES DE ENTORNO.
- PUEDE CAMBIAR ESTAS VARIABLES DE ENTORNO SEGUN SUS PREFERENCIAS PARA HACER EL TESTEO CON SU BASE DE DATOS LOCAL (RECUERDE QUE SE UTILIZO POSTGRESQL PARA ESTE EJERCICIO)


SERVICIOS:

Ruta general:
http://localhost:9000/

Inscripcion de usuario
http://localhost:9000/auth/signup
 --> Solicitud tipo POST, recibe por body estos parametros {
            name: name,
            email: email,
            userType: userType (DEBE SER '0' PARA ADMINISTRADORES, '1' PARA DEMAS USUARIOS),
            password: password,
            confirmPassword: confirmPassword
        }

Inicio de sesion (logeo)
http://localhost:9000/auth/login
 --> Solicitud tipo post, recibe por body estos parametros {
            email: email,
            password: password,
        }  


TOMAR EL TOKEN DE AUTENTICACIÓN DEL LOGIN O DEL SIGNUP

Tickets: (TODAS LAS RUTAS SIGUIENTES DEBEN ENTREGAR EL TOKEN DE AUTENTICACIÓN POR HEADERS COMO BARRER TOKEN)

http://localhost:9000/tikects?page="X"&&results_per_page="Y"
--> Solicitud de tipo GET, entrega todos los tickets, se pueden pasar por query params los valores "X" y "Y" para indicar página y total de resultados por página

http://localhost:9000/tikects/newticket
--> Solicitud tipo POST, recibe por body {
            code: code,
            description: description,
            summary: summary,
            userId: userId
        }

http://localhost:9000/tikects/delete/:id
--> Solicitud tipo DELETE, recibe por params el id del ticket a eliminar

http://localhost:9000/tikects/update/:id
-> Solicitud tipo PUT, recibe por params el id del ticket a actualizar y por body: { description, summary }


Usuarios:

http://localhost:9000/users?page="X"&&results_per_page="Y"
--> Solicitud de tipo get, entrega todos los usuarios, se pueden pasar por query params los valores "X" y "Y" para indicar página y total de resultados por página

http://localhost:9000/users/delete/:id
--> Solicitud tipo DELETE, recibe por params el id del usuario a eliminar

http://localhost:9000/users/update/:id
-> Solicitud tipo PUT, recibe por params el id del usuario a actualizar y por body: { contract_date, name, email, salary, userType }
