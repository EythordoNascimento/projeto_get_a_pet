const Pet = require('../models/Pet')

// helpers
const getUserByToken = require('../helpers/get-user-by-token')
const getToken = require('../helpers/get-token')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController {
  // get authenticated user or return 401
  static async getAuthUser(req, res) {
    const token = getToken(req)
    const user = await getUserByToken(token)

    if (!user) {
      res.status(401).json({ message: 'Usuário não autenticado.' })
      return null
    }

    return user
  }

  // create a pet
  static async create(req, res) {
    const { name, age, description, weight, color } = req.body
    const images = req.files
    const available = true

    if (!name || !age || !weight || !color || !images) {
      return res.status(422).json({ message: 'Todos os campos obrigatórios devem ser preenchidos!' })
    }

    const user = await PetController.getAuthUser(req, res)
    if (!user) return

    const pet = new Pet({
      name,
      age,
      description,
      weight,
      color,
      available,
      images: images.map(image => image.filename),
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone,
      },
    })

    try {
      const newPet = await pet.save()
      res.status(201).json({ message: 'Pet cadastrado com sucesso!', newPet })
    } catch (error) {
      res.status(500).json({ message: 'Erro ao salvar o pet.', error: error.message })
    }
  }

  // get all registered pets
  static async getAll(req, res) {
    const pets = await Pet.find().sort('-createdAt')
    res.status(200).json({ pets })
  }

  // get all user pets
  static async getAllUserPets(req, res) {
    const user = await PetController.getAuthUser(req, res)
    if (!user) return

    const pets = await Pet.find({ 'user._id': user._id })
    res.status(200).json({ pets })
  }

  // get all user adoptions
static async getAllUserAdoptions(req, res) {
  const user = await PetController.getAuthUser(req, res)
  if (!user) return

  try {
    // busca pets onde o adotante é o usuário logado
    const pets = await Pet.find({ 'adopter._id': user._id })
    res.status(200).json({ pets })
  } catch (err) {
    res.status(400).json({ message: 'Não foi possível carregar as adoções.' })
  }
}

  // get a specific pet
  static async getPetById(req, res) {
    const id = req.params.id

    if (!ObjectId.isValid(id)) {
      return res.status(422).json({ message: 'ID inválido!' })
    }

    const pet = await Pet.findOne({ _id: id })

    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado!' })
    }

    res.status(200).json({ pet })
  }

  // remove a pet
  static async removePetById(req, res) {
    const id = req.params.id

    if (!ObjectId.isValid(id)) {
      return res.status(422).json({ message: 'ID inválido!' })
    }

    const pet = await Pet.findOne({ _id: id })
    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado!' })
    }

    const user = await PetController.getAuthUser(req, res)
    if (!user) return

    if (pet.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Você não tem permissão para remover este pet.' })
    }

    await Pet.findByIdAndRemove(id)
    res.status(200).json({ message: 'Pet removido com sucesso!' })
  }

  // update a pet
  static async updatePet(req, res) {
    const id = req.params.id
    const { name, age, description, weight, color, available } = req.body
    const images = req.files

    const pet = await Pet.findOne({ _id: id })
    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado!' })
    }

    const user = await PetController.getAuthUser(req, res)
    if (!user) return

    if (pet.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Você não tem permissão para atualizar este pet.' })
    }

    const updateData = {}
    if (name) updateData.name = name
    if (age) updateData.age = age
    if (description) updateData.description = description
    if (weight) updateData.weight = weight
    if (color) updateData.color = color
    if (available !== undefined) updateData.available = available
    if (images && images.length > 0) {
      updateData.images = images.map(image => image.filename)
    }

    await Pet.findByIdAndUpdate(id, updateData)
    res.status(200).json({ message: 'Pet atualizado com sucesso!' })
  }

  // schedule a visit
  static async schedule(req, res) {
    const id = req.params.id
    const pet = await Pet.findOne({ _id: id })
    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado!' })
    }

    const user = await PetController.getAuthUser(req, res)
    if (!user) return

    if (pet.user._id.equals(user._id)) {
      return res.status(422).json({ message: 'Você não pode agendar uma visita com seu próprio Pet!' })
    }

    if (pet.adopter && pet.adopter._id.equals(user._id)) {
      return res.status(422).json({ message: 'Você já agendou uma visita para este Pet!' })
    }

    pet.adopter = {
      _id: user._id,
      name: user.name,
      image: user.image,
    }

    await Pet.findByIdAndUpdate(pet._id, pet)
    res.status(200).json({
      message: `Visita agendada com sucesso. Contate ${pet.user.name} no telefone: ${pet.user.phone}`,
    })
  }

  // conclude a pet adoption
  static async concludeAdoption(req, res) {
    const id = req.params.id
    const pet = await Pet.findOne({ _id: id })
    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado!' })
    }

    pet.available = false
    await Pet.findByIdAndUpdate(pet._id, pet)

    res.status(200).json({
      pet,
      message: 'Parabéns! A adoção foi finalizada com sucesso!',
    })
  }
}