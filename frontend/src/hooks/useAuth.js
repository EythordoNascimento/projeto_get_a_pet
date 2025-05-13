import api from '../utils/api';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useFlashMessage from './userFlashMessage';

export default function useAuth() {
    const { setFlashMessage } = useFlashMessage(); // Movendo para dentro do Hook personalizado

    async function register(user) {
        let msgText = 'Cadastro realizado com sucesso!';
        let msgType = 'Sucesso';

        try {
            const data = await api.post('/users/register', user).then(response => response.data);
            console.log(data);
        } catch (error) {
            msgText = 'Ocorreu um erro inesperado';
            msgType = 'Error';

            // Verifica se error.response existe antes de acessar error.response.data
            if (error.response && error.response.data) {
                msgText = error.response.data.message;
            }

            setFlashMessage(msgText, msgType);
        }
    }

    return { register };
}