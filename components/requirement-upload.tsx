'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, CheckCircle, X } from 'lucide-react'

interface RequirementUploadProps {
  onUpload: (file: File) => Promise<void>
  label: string
  accepted?: string[]
  isCompleted?: boolean
}

export default function RequirementUpload({
  onUpload,
  label,
  accepted = ['application/pdf', 'image/png', 'image/jpeg'],
  isCompleted = false,
}: RequirementUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return
      const file = acceptedFiles[0]
      setUploading(true)
      setError(null)
      try {
        await onUpload(file)
        setUploadedFile(file.name)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setUploading(false)
      }
    },
    [onUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accepted.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: 1,
    disabled: isCompleted || uploading,
  })

  if (isCompleted) {
    return (
      <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <span className="text-green-800 font-medium text-sm">{label} — Submitted</span>
      </div>
    )
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        {uploadedFile ? (
          <div className="flex items-center justify-center gap-2">
            <File className="h-5 w-5 text-indigo-600" />
            <span className="text-sm text-gray-700">{uploadedFile}</span>
          </div>
        ) : (
          <div>
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {isDragActive ? 'Drop file here' : `Drag & drop ${label} or click to browse`}
            </p>
            <p className="text-xs text-gray-400 mt-1">PDF, PNG, JPG accepted</p>
          </div>
        )}
        {uploading && (
          <div className="mt-2">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-1 bg-indigo-600 rounded-full animate-pulse w-2/3" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Uploading...</p>
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
          <X className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  )
}
