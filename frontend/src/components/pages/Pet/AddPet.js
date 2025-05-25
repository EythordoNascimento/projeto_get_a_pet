import api from '../../../utils/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🔄 Correção aqui!

import styles from './AddPet.module.css';
import PetForm from '../../form/PetForm';

/* hooks */
import useFlashMessage from '../../../hooks/useFlashMessage';

function AddPet() {
  const [token] = useState(localStorage.getItem('token') || '');
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate(); // 🔄 Correção aqui!

  async function registerPet(pet) {
    let msgType = 'success';

    const formData = new FormData();

    Object.keys(pet).forEach((key) => { // 🔄 Removido `await`, pois `forEach` não funciona bem com `async`
      if (key === 'images') {
        for (let i = 0; i < pet[key].length; i++) {
          formData.append('images', pet[key][i]);
        }
      } else {
        formData.append(key, pet[key]);
      }
    });

    try {
      const response = await api.post('pets/create', formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setFlashMessage(response.data.message, msgType);
      navigate('/pet/mypets'); // 🔄 Substituído `history.push()` por `navigate()`
    } catch (err) {
      console.log(err);
      msgType = 'error';
      setFlashMessage(err.response?.data?.message || 'Erro ao cadastrar pet', msgType);
    }
  }

  return (
    <section>
      <div className={styles.addpet_header}>
        <h1>Cadastre um Pet</h1>
        <p>Depois ele ficará disponível para adoção</p>
      </div>
      <PetForm handleSubmit={registerPet} btnText="Cadastrar" />
    </section>
  );
}

export default AddPet;