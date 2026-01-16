const express = require('express');
const cluster = require('cluster');
const os = require('os');
const cors = require('cors');
const connectDB = require('./config/db');
const GeneticMutator = require('./utils/geneticAlgo');
const VariantLog = require('./models/VariantLog');

const numCPUs = os.cpus().length;

// >>> THE IMMUNE SYSTEM MEMORY <<<
let consecutiveDeaths = 0;
let immunityActive = false;
let lastImmunityTime = 0; // NEW: Tracks when we last used the shield

if (cluster.isMaster) {
    console.log(`>> [SYSTEM]: MASTER ${process.pid} INITIALIZED.`);
    console.log(`>> [MODE]: CYCLICAL IMMUNITY (WITHDRAWAL ENFORCED).`);

    for (let i = 0; i < numCPUs; i++) cluster.fork();

    cluster.on('exit', (worker, code, signal) => {
        console.log(`>> [SYSTEM]: WORKER ${worker.process.pid} DIED. Respawning...`);
        cluster.fork();
    });

} else {
    connectDB();
    const app = express();
    app.use(express.json());
    app.use(cors());

    app.post('/evolve', async (req, res) => {
        
        // >>> CHECK IMMUNITY STATUS <<<
        if (immunityActive) {
            try {
                // Log the shield
                await VariantLog.create({
                    total_traffic: 100,
                    surviving_variant: "ANTIBODY_LOCKDOWN", 
                    fitness_score: 500 
                });
            } catch(e) {}
            return res.status(200).json({ status: "IMMUNE", variant: "SHIELD_UP" });
        }

        // >>> NORMAL CHAOS LOGIC <<<
        const chaosRoll = Math.random(); 
        
        if (chaosRoll < 0.30) {
            // VIRUS ATTACK!
            consecutiveDeaths++; 

            // CHECK: Are deaths high enough? AND Has it been 10 seconds since last shield?
            const timeSinceLastShield = Date.now() - lastImmunityTime;
            
            if (consecutiveDeaths >= 3 && timeSinceLastShield > 10000) {
                console.log(">> [ALERT]: OUTBREAK. ACTIVATING SHIELD.");
                
                immunityActive = true;
                consecutiveDeaths = 0; 
                lastImmunityTime = Date.now(); // Mark the time
                
                // Immunity lasts 5 seconds
                setTimeout(() => {
                    console.log(">> [SYSTEM]: SHIELD DOWN. ENTERING VULNERABILITY PHASE.");
                    immunityActive = false;
                }, 5000);
            }

            // Log the death
             try {
                await VariantLog.create({
                    total_traffic: 100,
                    surviving_variant: "VIRUS_OUTBREAK", 
                    fitness_score: 0 
                });
             } catch(e) {}

             return res.status(500).json({ status: "CRITICAL_FAILURE", cause: "VIRUS" });
        }

        // >>> NORMAL SURVIVAL <<<
        consecutiveDeaths = 0; 
        
        const batch = [
            { type: 'SEX', val: Math.random() * 50 },
            { type: 'SIMRAN_MEMORY', val: Math.random() * 100 },
            { type: 'CODE', val: Math.random() * 100 },
            { type: 'SURVIVAL', val: Math.random() * 100 + 50 } 
        ];

        const mutator = new GeneticMutator(batch);
        const result = mutator.evolve();

        try {
            await VariantLog.create({
                total_traffic: 100,
                surviving_variant: result.survivor.type,
                fitness_score: result.fitness
            });
            res.status(200).json({ status: "SURVIVED", variant: result.survivor.type });
        } catch (error) {
            res.status(500).json({ status: "DB_ERROR" });
        }
    });

    app.get('/stats', async (req, res) => {
        try {
            const logs = await VariantLog.find().sort({ timestamp: -1 }).limit(50);
            res.json(logs.reverse());
        } catch (err) {
            res.status(500).json({ error: "DB_ERROR" });
        }
    });

    // Use the Cloud's port (process.env.PORT) or 3000 if local
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`>> [SYSTEM]: SERVER ONLINE ON PORT ${PORT}`);
});
}