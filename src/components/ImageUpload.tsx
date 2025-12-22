import { useState } from 'react'
import styled from 'styled-components'
import { RecipeImage } from '../types'
import { uploadRecipeImage, updateImageRole, deleteImage } from '../lib/api'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const UploadButton = styled.label`
  background-color: #c6b7a8;
  color: #484848;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: #b5a699;
  }

  input {
    display: none;
  }
`

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
`

const ImageCard = styled.div<{ $role: string | null }>`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 3px solid ${props =>
    props.$role === 'primary' ? '#6a0d2b' :
    props.$role === 'secondary' ? '#d18b4f' :
    'transparent'
  };
`

const Thumbnail = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
`

const ImageActions = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px;
  background-color: #f4f1e1;
`

const ActionButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 4px;
  font-size: 11px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.$active ? '#6a0d2b' : '#c6b7a8'};
  color: ${props => props.$active ? 'white' : '#484848'};

  &:hover {
    opacity: 0.8;
  }
`

const DeleteButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #dc3545;
  }
`

const RoleBadge = styled.span`
  position: absolute;
  top: 4px;
  left: 4px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  text-transform: uppercase;
`

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
      // Update local state
      onImagesChange(images.map(img => {
        if (img.id === imageId) {
          return { ...img, role: newRole }
        }
        // Clear primary from other images if setting new primary
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

  return (
    <Container>
      <UploadButton>
        {uploading ? 'Uploading...' : 'Add Images'}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={uploading}
        />
      </UploadButton>

      {images.length > 0 && (
        <ImageGrid>
          {images.map(image => (
            <ImageCard key={image.id} $role={image.role}>
              <Thumbnail src={image.url} alt="" />
              {image.role && <RoleBadge>{image.role}</RoleBadge>}
              <DeleteButton onClick={() => handleDelete(image)}>x</DeleteButton>
              <ImageActions>
                <ActionButton
                  $active={image.role === 'primary'}
                  onClick={() => handleRoleChange(
                    image.id,
                    image.role === 'primary' ? null : 'primary'
                  )}
                >
                  Primary
                </ActionButton>
                <ActionButton
                  $active={image.role === 'secondary'}
                  onClick={() => handleRoleChange(
                    image.id,
                    image.role === 'secondary' ? null : 'secondary'
                  )}
                >
                  Secondary
                </ActionButton>
              </ImageActions>
            </ImageCard>
          ))}
        </ImageGrid>
      )}
    </Container>
  )
}

export default ImageUpload
