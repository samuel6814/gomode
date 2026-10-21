const validateInput = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid input data',
            errors: error.errors 
        });
    }
};

module.exports = validateInput;