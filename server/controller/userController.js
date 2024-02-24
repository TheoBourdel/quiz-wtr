import UserModel from '../model/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        const exist = await UserModel.findOne({ where: {username} });

        if (exist && exist.dataValues.username === username) {
            return res.status(400).json({ message: 'Un compte est déjà attribué à cet utilisateur' });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        console.log(role)
        const user = await UserModel.create({ username, password: hash, role:'USER'});

        if (user) {
            const token = createToken(user.id)
            res.status(201).json({ user, token });
        } else {
            res.status(500).json({ message: 'Erreur lors de la création du compte' });
        }
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

export const login = async (req, res) => {

    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ where: { username } });
        if(!user) {
            return res.status(400).json({message: "Utilisateur non trouvé"});
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match) {
            return res.status(400).json({message: "Mauvais mot de passe"});
        }
        const token = createToken(user.id)
        
        return res.json({user})

    } catch (err) {
        res.status(500).json({ err });
    }
}

const createToken = (id) => {
    console.log(id)
    return jwt.sign({id}, process.env.SECRET,{
        expiresIn: '3d'
    })
}


export const logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) {
        return res.sendStatus(204);
    }

    const user = await UserModel.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) {
        return res.sendStatus(204);
    }
    const userId = user[0].id;

    await UserModel.update({refresh_token: null},{
        where:{
            id: userId
        }
    });
    
    res.clearCookie('token');
    return res.json({status: "succes"})
}


export const verifyJwt = async(req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json({message: "We need token, please provide it"})
    } else {
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if(err) {
                return res.json({message: "Authentification error"})
            } else {
                req.userId = decoded.id;
                next();
            }
        })
    }
}

export const profile = async(req, res) => {
    console.log(req.userId)
    try {
        UserModel.findOne({
            where: {
                id: req.userId
            }
        })
        .then(user => {
            if (user) {
                console.log(user)
                res.json(user)
            } else {
                res.send('User does not exist')
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
    } catch (err) {
        res.status(500).json({ err });
    }
}



