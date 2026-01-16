const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    total_traffic: { type: Number, required: true },
    surviving_variant: { type: String, required: true },
    fitness_score: { type: Number },
    strategy: { type: String, default: 'GENETIC_SELECTION' },
    cpu_usage: { type: Number },
    memory_usage: { type: Number }
});

module.exports = mongoose.model('VariantLog', VariantSchema);
