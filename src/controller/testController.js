const testRepository = require('../repository/testRepository');

exports.testController = async (req, res) =>{
    try {
        let result = await testRepository.test();
        console.log(result)
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
}