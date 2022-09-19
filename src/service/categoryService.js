
const categoryRepository = require('../repository/categoryRepository');

let categoryService = {
    getAllCategories : async () => {
        try {
            let categories = await categoryRepository.getAll();
            return Promise.resolve(categories);
        } catch (error) {
            return (error);
        }
    }
}


module.exports = categoryService