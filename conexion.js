var express = require('express');
var app = express();
var router = express.Router();
var bodyparser = require('body-parser');
var cors = require('cors');
var oracledb = require('oracledb');
app.use(cors());

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));


var connAttrs = {
    "user": "VENTAMN",
    "password": "ventamn"
        /*,
            "connectString": "(DESCRIPTION =(LOAD_BALANCE = ON)(FAILOVER = ON)(ADDRESS =(PROTOCOL = TCP)(HOST = localhost)(PORT = 65078))(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT=65078))(CONNECT_DATA=(SERVICE_NAME=XE)(FAILOVER_MODE=(TYPE=SELECT)(METHOD = BASIC))))"*/
}
app.get('/Cliente', function(req, res) {
    "use strict";

    oracledb.getConnection(connAttrs, function(err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: ["Error connecting to DB"],
                detailed_message: err.message
            }));
            return;
        }
        connection.execute("SELECT * FROM cliente", {}, {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function(err, result) {
            if (err) {
                res.set('Content-Type', 'application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: ["Error getting the dba_tablespaces"],
                    detailed_message: err.message
                }));
            } else {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
                res.contentType('application/json').status(200);
                res.send(
                    JSON.stringify({
                        status: 1,
                        message: result.rows,
                        detailed_message: "ok"
                    }));

            }
            // Release the connection
            connection.release(
                function(err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /sendTablespace : Connection released");
                    }
                });
        });
    });
});


app.listen(3000, function() {
    console.log("Live at Port 3000");
});