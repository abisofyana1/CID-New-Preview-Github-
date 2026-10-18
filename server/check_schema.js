const db = require('./db');

async function checkSchema() {
    try {
        const res = await db.query(`
            SELECT column_name, data_type, character_maximum_length 
            FROM information_schema.columns 
            WHERE table_name = 'tbl_complain'
            AND (column_name = 'noreff' OR column_name = 'idchannel_note' OR column_name = 'cust_name' OR column_name = 'idproduct_note' OR column_name = 'idsubject_note');
        `);
        console.log("Schema Check Results:");
        res.rows.forEach(row => {
            console.log(`${row.column_name}: ${row.data_type}(${row.character_maximum_length})`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkSchema();
