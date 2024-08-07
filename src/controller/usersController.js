import users from '../db/models/users.js'


const getUsers = async (req, res) => {
    try {

        let limit = 9
        let offSet = 0

        const { page, results_per_page } = req.query

        if (results_per_page) {
            limit = results_per_page
        }

        if (page) {
            offSet = (page - 1) * limit
        }

        let allUsers = await users.findAll({
            offset: offSet,
            limit: limit
        })

        const total = await users.count()

        res.status(200).json({
            status: 'success',
            data: allUsers,
            total: total
        });
    } catch (error) {
        res.status(500).send({ error: error })
    }
};


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await users.findByPk(id);
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'invalid user id'
            });
        }
        await user.destroy();
        res.status(200).json({
            status: 'success',
            mensaje: 'user deleted',
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


const updateUser = async (req, res) => {
    try {
        const { contract_date, name, email, salary, userType } = req.body;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: 'fail',
                message: 'user id are required'
            });
        }

        const user = await users.findByPk(id);

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'user not found'
            });
        }

        user.contract_date = contract_date ? contract_date : user.contract_date;
        user.name = name ? name : user.name;
        user.email = email ? email : user.email;
        user.salary = salary ? salary : user.salary;
        user.userType = userType ? userType : user.userType

        const updateUser = await user.save();

        return res.status(200).json({
            status: 'success',
            message: `updated user ${id}`,
            data: updateUser
        });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export { getUsers, deleteUser, updateUser }
