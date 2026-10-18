const db = require('./db');

async function fixSchema() {
    try {
        console.log("Fixing schema lengths...");

        const columns = [
            'noreff',
            'idchannel_note',
            'idproduct_note',
            'idsubject_note',
            'cust_name',
            'cust_lok',
            'cust_note' // Note Nasabah
        ];

        for (const col of columns) {
            console.log(`Altering ${col}...`);
            // Postgres syntax to change column type
            await db.query(`ALTER TABLE tbl_complain ALTER COLUMN "${col}" TYPE VARCHAR(1000);`);
        }

        console.log("Schema updated successfully.");

    } catch (err) {
        console.error("Error updating schema:", err);
    } finally {
        process.exit();
    }
}

fixSchema();
