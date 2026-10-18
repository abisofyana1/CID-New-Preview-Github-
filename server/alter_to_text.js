const db = require('./db');

async function convertToText() {
    try {
        console.log("Converting columns to TEXT (Unlimited) for tbl_complain...");

        // List of columns to convert to TEXT
        // This removes character limits and supports all special characters
        const columns = [
            'noreff',
            'idchannel_note',
            'idproduct_note',
            'idsubject_note',
            'cust_name',
            'cust_lok',
            'cust_note',      // Note Nasabah
            'notes',          // Internal Note
            'cmessage',       // Question
            'cmessage_re'     // Answer
        ];

        for (const col of columns) {
            console.log(`changing ${col} to TEXT...`);
            // Postgres TEXT type is unlimited length
            await db.query(`ALTER TABLE tbl_complain ALTER COLUMN "${col}" TYPE TEXT;`);
        }

        console.log("Database schema updated: All specified columns are now TEXT (Unlimited).");

    } catch (err) {
        console.error("Error updating schema:", err);
    } finally {
        process.exit();
    }
}

convertToText();
