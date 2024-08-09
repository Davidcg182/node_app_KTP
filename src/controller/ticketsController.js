import tickets from '../db/models/tickets.js';
import users from '../db/models/users.js';
import { Op } from "sequelize";

const getTickets = async (req, res) => {
    try {
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

        if (req.user.userType === '1') {
            filter = {
                where: {
                    userId: req.user.id
                }
            };
        }

        if (search) {
            filter.where = {
                ...filter.where,
                [Op.or]: [
                    { code: { [Op.iLike]: `%${search}%` } },
                    { description: { [Op.iLike]: `%${search}%` } },
                    { summary: { [Op.iLike]: `%${search}%` } }
                ]
            };
        }

        const totalFiltered = await tickets.count(filter);

        let allTikets = await tickets.findAll({
            ...filter,
            offset: offSet,
            limit: limit
        });

        allTikets = await Promise.all(allTikets.map(async ticket => {
            const userId = ticket.userId;
            const userSQ = await users.findOne({ where: { id: userId } });
            const user = userSQ.toJSON()
            delete user.password
            return { ...ticket.toJSON(), user: user };
        }));

        return res.status(200).json({
            status: 'success',
            data: allTikets,
            total: totalFiltered
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};



const createTicket = async (req, res) => {
    try {
        const { code, description, summary, userId } = req.body;

        if (!code || !description || !userId) {
            return res.status(400).json({
                status: 'fail',
                message: 'code, description and userId is required'
            });
        };

        const newTicket = await tickets.create({
            code: code,
            description: description,
            summary: summary,
            userId: userId
        });

        const userSQ = await users.findByPk(userId);
        const user = userSQ.toJSON()
        delete user.password

        const response = { ...newTicket.dataValues, user: user }

        return res.status(200).json({
            status: 'success',
            data: response
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const deleteTicket = async (req, res) => {
    try {
        const { id } = req.params
        const ticket = await tickets.findByPk(id);
        if (!ticket) {
            return res.status(404).json({
                status: 'fail',
                message: 'invalid ticket id'
            });
        }
        await ticket.destroy();
        res.status(200).json({
            status: 'success',
            mensaje: 'ticket deleted'
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


const updateTicket = async (req, res) => {
    try {
        const { description, summary } = req.body;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: 'fail',
                message: 'ticket id are required'
            });
        }

        const ticket = await tickets.findByPk(id);

        if (!ticket) {
            return res.status(404).json({
                status: 'fail',
                message: 'Ticket not found'
            });
        }

        ticket.description = description ? description : ticket.description;
        ticket.summary = summary ? summary : ticket.summary;

        const updated = await ticket.save();

        const userSQ = await users.findByPk(updated.userId);
        const user = userSQ.toJSON()
        delete user.password

        const response = { ...updated.dataValues, user: user }

        return res.status(200).json({
            status: 'success',
            message: `updated ticket ${id}`,
            data: response
        });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


export { getTickets, createTicket, deleteTicket, updateTicket }
