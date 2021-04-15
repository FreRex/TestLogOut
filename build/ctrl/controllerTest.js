"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = (req, res, next) => {
    const { isNull } = require("util");
    const { Console } = require("console");
    const { Verify } = require("crypto");
    const Pool = require("pg").Pool;
    const mymodule = require('../conf/connInfo');
    const pool_collaudolive = mymodule.conn_info_collaudolive_ssl_cry;
    // Funzioni Connessioni
    async function ConnessioneCollaudoLive() {
        console.log('Inizio tentativo connessione con db CollaudoLive');
        const client = await pool_collaudolive.connect();
        console.log('Connessione a db CollaudoLive avvenuta !');
        client.release();
    }
    //Determinazione nominativo comune da CollaudoLive-Postgresql;
    async function comune(pk_proj) {
        // Name 
        const sql_name = { text: 'SELECT projects.pk_projects, projects.fk_comune, id_comune_decode.pk_comune, id_comune_decode.nome FROM newfont_dati.projects INNER JOIN newfont_dati.id_comune_decode ON projects.fk_comune = id_comune_decode.pk_comune WHERE projects.pk_projects = ' + pk_proj + '', rowMode: 'array' };
        const namecolla = await pool_collaudolive.query(sql_name);
        let namecolla1 = namecolla.rows;
        const name = namecolla1[0][3];
        console.log(name);
        // Coordinate 
        let coord_terminazione;
        const sql_coord = { text: 'SELECT coord_terminazione FROM newfont_dati.prj_nodes WHERE prj_nodes.coord_terminazione IS NOT NULL AND prj_nodes.drawing = ' + pk_proj + ' LIMIT 1', rowMode: 'array' };
        const coordcolla = await pool_collaudolive.query(sql_coord);
        let coordcolla1 = coordcolla.rows;
        if (coordcolla1[0][0]) {
            coord_terminazione = coordcolla1[0][0];
        }
        else {
            coord_terminazione = '43.092922,12.361422';
        }
        console.log(coord_terminazione);
        let coo = coord_terminazione.split(",");
        let lat_centro_map;
        lat_centro_map = coo[0];
        let long_centro_map;
        long_centro_map = coo[1];
        console.log(lat_centro_map);
        console.log(long_centro_map);
    }
    ConnessioneCollaudoLive();
    //test
    let drawing = 129743824;
    console.log(comune(drawing));
};
