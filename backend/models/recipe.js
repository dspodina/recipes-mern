import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    }, 
    
    title: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    ingredients: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    }
});

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
