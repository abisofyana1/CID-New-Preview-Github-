const db = require('./db');

async function syncSequence() {
    try {
        console.log("Syncing sequence for tbl_complain...");

        // 1. Get the Max ID
        const resMean = await db.query("SELECT MAX(id) as max_id FROM tbl_complain");
        const maxId = resMean.rows[0].max_id || 0;

        console.log(`Current Max ID is: ${maxId}`);

        // 2. Set the sequence to Max ID
        // Note: checking if sequence exists first or just assume standard naming
        // Standard naming for serial is table_name_id_seq
        await db.query(`SELECT setval('tbl_complain_id_seq', $1)`, [maxId]);

        console.log("Sequence 'tbl_complain_id_seq' has been synced successfully.");

    } catch (err) {
        console.error("Error syncing sequence:", err);
    } finally {
        // We can't close the pool if it's imported from db.js as it might be used by the app, 
        // but for a standalone script we should force exit or let the process finish.
        process.exit();
    }
}

syncSequence();
