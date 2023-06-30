const testController = (req,res)=>{
    res.status(200).send({
        message: "test ",
        success: true,
    })
}

module.exports = {testController};