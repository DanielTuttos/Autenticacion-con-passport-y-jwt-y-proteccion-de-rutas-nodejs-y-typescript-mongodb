import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';
import config from '../config/config';

function createToken(user: IUser) {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
        expiresIn: 86400
    });
}

export const signUp = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Porfavor envie si email y contraseña'
        });
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({
            ok: false,
            mensaje: 'El usuario ya existe'
        });
    }

    const newUser = new User(req.body);

    await newUser.save();

    return res.status(201).json({
        ok: true,
        usuario: newUser
    })
}

export const signIn = async (req: Request, res: Response) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Porfavor envie su email y contraseña'
        });
    }

    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Este usuario no existe'
        });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
        return res.status(200).json({
            ok: true,
            token: createToken(user),
            usuario: { id: user.id, email: user.email }
        })
    }

    return res.status(400).json({
        ok: false,
        mensaje: 'El correo o la contraseña son incorrectas'
    })

}