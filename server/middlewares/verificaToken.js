import jwt from "jsonwebtoken";

const CHAVE = process.env.SECERET_KEY_LOGIN;

export function verificaToken(req, res, next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message: "Token não fornecido!" });
    }

    jwt.verify(token, CHAVE, (err, decoded) => {
        if (err) {
            console.log("Erro ao verificar token: ", err);
            return res.status(403).json({ error: "Token inválido!" });
        }
        req.user = decoded;
        next();
    });
}

export default verificaToken;