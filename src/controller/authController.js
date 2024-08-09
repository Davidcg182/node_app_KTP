import users from '../db/models/users.js'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'


/*** ESTAS CONSTANTES DEBO PASARLAS A VARIABLES DE ENTORNO ***/
const secretKey = 'very-long-secret-key-marcos';
const expiresIn = '90d'

const generateToken = (payload) => {
    return jwt.sign(payload, secretKey, {
        expiresIn: expiresIn
    })
}

const signup = async (req, res) => {

    const { name, email, userType, password, confirmPassword } = req.body;

    if (!['0', '1'].includes(userType)) {
        return res.status(400).json({
            status: 'fail',
            message: 'invalid user type'
        })
    };

    try {
        const newUser = await users.create({
            name: name,
            email: email,
            userType: userType,
            password: password,
            confirmPassword: confirmPassword
        })

        if (!newUser) {
            return res.status(400).json({
                status: 'fail',
                message: 'Failed to create user'
            })
        }

        const result = newUser.toJSON()

        delete result.password

        result.token = generateToken({
            id: result.id
        })

        res.status(201).json({
            status: 'success',
            data: result
        });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }

};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'email and password required'
        })
    };

    const result = await users.findOne({ where: { email: email } });

    if (!result || !(await bcryptjs.compare(password, result.password))) {
        return res.status(401).json({
            status: 'fail',
            message: 'Incorrect email or password'
        })
    };

    const token = generateToken({
        id: result.id
    });

    return res.json({
        status: 'success',
        token: token,
        user: result
    })

}

const authentication = async (req, res, next) => {

    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        return res.status(401).json({
            status: 'fail',
            message: 'invalid token'
        })
    };

    const idToken = req.headers.authorization.split(' ')[1]

    if (!idToken) {
        return res.status(401).json({
            status: 'fail',
            message: 'please login to access'
        })
    };

    let tokenDetail;
    try {
        tokenDetail = jwt.verify(idToken, secretKey)
    } catch (error) {
        return res.status(401).json({
            status: 'fail',
            message: 'invalid token'
        })
    }

    const freshUser = await users.findByPk(tokenDetail.id)

    if (!freshUser) {
        return res.status(401).json({
            status: 'fail',
            message: 'user no loger exist'
        })
    };

    req.user = freshUser

    return next()
}


const restrictTo = (...userType) => {
    const checkpermission = (req, res, next) => {
        if (!userType.includes(req.user.userType)) {
            return res.status(400).json({
                status: 'fail',
                message: 'auth required'
            })
        }

        return next()
    }

    return checkpermission
}

export { signup, login, authentication, restrictTo }
