const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '../.env'),
    override: true
});

const app = express();
const port = process.env.APP_PORT; // Loaded from .env via dotenv above

if (!port) {
    console.error('[CRITICAL ERROR] APP_PORT is not defined in the .env file.');
    console.error('The application will not start without an explicitly declared APP_PORT.');
    process.exit(1);
}

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Routes
const complaintRoutes = require('./routes/complaints');
const masterRoutes = require('./routes/master');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const activityRoutes = require('./routes/activity');

app.use('/api/complaints', complaintRoutes);
app.use('/api/master', masterRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/system', require('./routes/system'));

app.get('/api', (req, res) => {
    res.send('BNI App Backend API Running');
});

// The "catchall" handler: for any request that doesn't 
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const os = require('os');

app.listen(port, () => {
    let localIp = '127.0.0.1';
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (let i = 0; i < interfaces.length; i++) {
            const iface = interfaces[i];
            if (iface.family === 'IPv4' && !iface.internal) {
                localIp = iface.address;
                break;
            }
        }
        if (localIp !== '127.0.0.1') break;
    }

    console.log(`==========================================`);
    console.log(`  STARTING CID T&R APPLICATION SERVER`);
    console.log(`  Localhost URL : http://localhost:${port}`);
    console.log(`  Network URL   : http://${localIp}:${port}`);
    console.log(`==========================================`);
});
