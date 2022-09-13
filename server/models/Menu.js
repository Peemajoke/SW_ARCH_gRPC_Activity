const mongoose = require('mongoose')

const MenuSchema = new mongoose.Schema(
    {
    //   id: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
    },
)

const MenuModel = mongoose.model('menus', MenuSchema)
module.exports = MenuModel