import mongoose, { Schema } from 'mongoose'

const wasteSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  _id: {
    type: String
  },
  name: {
    type: String
  },
  aliases: {
    type: String
  },
  category: {
    type: String
  },
  badges: {
    type: String
  },
  description: {
    type: String
  },
  notes: {
    type: String
  },
  image: {
    type: String
  },
  creation_date: {
    type: String
  },
  last_edit_date: {
    type: String
  }
}, {
  timestamps: true
})

wasteSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      _id: this._id,
      name: this.name,
      aliases: this.aliases,
      category: this.category,
      badges: this.badges,
      description: this.description,
      notes: this.notes,
      image: this.image,
      creation_date: this.creation_date,
      last_edit_date: this.last_edit_date,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Waste', wasteSchema)

export const schema = model.schema
export default model
