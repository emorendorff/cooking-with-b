import { useState } from 'react'
import { RecipeImage } from '../types'
import { uploadRecipeImage, updateImageRole, deleteImage } from '../lib/api'

interface ImageUploadProps {
  recipeId: string
  images: RecipeImage[]
  onImagesChange: (images: RecipeImage[]) => void
}

const ImageUpload = ({ recipeId, images, onImagesChange }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const newImages: RecipeImage[] = []
      for (const file of Array.from(files)) {
        const image = await uploadRecipeImage(recipeId, file)
        newImages.push(image)
      }
      onImagesChange([...images, ...newImages])
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleRoleChange = async (imageId: string, newRole: 'primary' | 'secondary' | null) => {
    try {
      await updateImageRole(imageId, newRole)
      onImagesChange(images.map(img => {
        if (img.id === imageId) {
          return { ...img, role: newRole }
        }
        if (newRole === 'primary' && img.role === 'primary') {
          return { ...img, role: null }
        }
        return img
      }))
    } catch (error) {
      console.error('Failed to update role:', error)
    }
  }

  const handleDelete = async (image: RecipeImage) => {
    if (!confirm('Delete this image?')) return

    try {
      await deleteImage(image.id, image.url)
      onImagesChange(images.filter(img => img.id !== image.id))
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const getBorderColor = (role: string | null) => {
    if (role === 'primary') return 'border-burgundy'
    if (role === 'secondary') return 'border-copper'
    return 'border-transparent'
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="bg-tan text-gray-700 border-none rounded px-6 py-3 font-semibold cursor-pointer text-center hover:bg-tan-hover">
        {uploading ? 'Uploading...' : 'Add Images'}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
          {images.map(image => (
            <div
              key={image.id}
              className={`relative rounded-lg overflow-hidden border-[3px] ${getBorderColor(image.role)}`}
            >
              <img src={image.url} alt="" className="w-full h-[120px] object-cover" />
              {image.role && (
                <span className="absolute top-1 left-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-[10px] uppercase">
                  {image.role}
                </span>
              )}
              <button
                onClick={() => handleDelete(image)}
                className="absolute top-1 right-1 bg-red-500/90 text-white border-none rounded-full w-6 h-6 cursor-pointer text-sm hover:bg-red-600"
              >
                x
              </button>
              <div className="flex gap-1 p-2 bg-cream">
                <button
                  onClick={() => handleRoleChange(image.id, image.role === 'primary' ? null : 'primary')}
                  className={`flex-1 p-1 text-[11px] border-none rounded cursor-pointer hover:opacity-80 ${
                    image.role === 'primary' ? 'bg-burgundy text-white' : 'bg-tan text-gray-700'
                  }`}
                >
                  Primary
                </button>
                <button
                  onClick={() => handleRoleChange(image.id, image.role === 'secondary' ? null : 'secondary')}
                  className={`flex-1 p-1 text-[11px] border-none rounded cursor-pointer hover:opacity-80 ${
                    image.role === 'secondary' ? 'bg-burgundy text-white' : 'bg-tan text-gray-700'
                  }`}
                >
                  Secondary
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageUpload
