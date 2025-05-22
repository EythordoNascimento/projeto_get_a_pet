import { useState  } from "react"

import formStyles from './Form.module.css'

import Input from './Input'


function PetForm({handleSubmit, petData, btnText}) {
     const [pet, setPet] = useState(petData || {})
     const [preview, setPreview] = useState([])
     const colors = ["Branco", "Preto", "Cinza", "Caramelo", "Mesclado"]

    return (
        <section>
            <h1>PetForm</h1>
        </section>
    )
}

export default PetForm