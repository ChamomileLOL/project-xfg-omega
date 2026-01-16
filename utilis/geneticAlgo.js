// utils/geneticAlgo.js
class GeneticMutator {
    constructor(population) {
        this.population = population; 
    }

    calculateFitness(thought) {
        let score = 0;
        if (thought.type === 'SEX' || thought.type === 'SIMRAN_MEMORY') score -= 100; 
        if (thought.type === 'CODE' || thought.type === 'ARCHITECT') score += 50;  
        if (thought.type === 'SURVIVAL') score += 200; 
        return score;
    }

    evolve() {
        if (!this.population || this.population.length === 0) return null;

        // SORTING ALGORITHM (Selection)
        this.population.sort((a, b) => {
            return this.calculateFitness(b) - this.calculateFitness(a);
        });

        const survivor = this.population[0];
        
        return {
            survivor: survivor,
            fitness: this.calculateFitness(survivor),
            generation_size: this.population.length
        };
    }
}

module.exports = GeneticMutator;