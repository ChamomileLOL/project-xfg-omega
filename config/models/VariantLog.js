const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    
    // The Input Load
    total_traffic: { type: Number, required: true },
    
    // The Survivor (The thought that won)
    surviving_variant: { type: String, required: true },
    fitness_score: { type: Number },

    // The Resolution Strategy
    strategy: { type: String, default: 'GENETIC_SELECTION' },

    // System Status
    cpu_usage: { type: Number },
    memory_usage: { type: Number }
});

module.exports = mongoose.model('VariantLog', VariantSchema);