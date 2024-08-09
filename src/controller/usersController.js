import users from '../db/models/users.js'
import { Op } from "sequelize";

const getUsers = async (req, res) => {
    try {

        if (req.user.userType === '1') {

            const userSQ = await users.findByPk(req.user.id);
            const user = userSQ.toJSON()
            delete user.password
            return res.status(200).json({
                status: 'success',
                data: [user],
                total: "1"
            });
        }

        let limit = 9;
        let offSet = 0;

        const { page, results_per_page, search } = req.query;

        if (results_per_page) {
            limit = parseInt(results_per_page);
        }

        if (page) {
            offSet = (page - 1) * limit;
        }

        let filter = {};
        if (search) {
            filter = {
                where: {
                    [Op.or]: [
                        { name: { [Op.iLike]: `%${search}%` } },
                        { email: { [Op.iLike]: `%${search}%` } }
                    ]
                }
            };
        }


        const totalFiltered = await users.count(filter);

        const allUsers = await users.findAll({
            ...filter,
            offset: offSet,
            limit: limit,
            attributes: { exclude: ['password'] }
        });

        return res.status(200).json({
            status: 'success',
            data: allUsers,
            total: totalFiltered
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
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

        const updateUserSQ = await user.save();
        const updateUser = updateUserSQ.toJSON()
        delete updateUser.password


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
