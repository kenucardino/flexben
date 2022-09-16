
const categoryRepository = require('../repository/categoryRepository');

let categoryService = {
    getAllCategories : async () => {
        try {
            let categories = await categoryRepository.get();
            return Promise.resolve(categories);
        } catch (error) {
            return (error);
        }
    }
}


module.exports = categoryService