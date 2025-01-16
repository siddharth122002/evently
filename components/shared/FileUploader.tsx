import { UploadButton } from '@/lib/uploadthing';
import React from 'react'

interface FileProps{
  onFileChange:(value:string)=>void,
}


function FileUploader({onFileChange}:FileProps) {
  return (
    <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          // console.log("Files: ----------------", res);
          if(res){
            onFileChange(res[0].url)
            
            alert("Upload Completed");
          }else{
            alert('res not acquired')
          }
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
  )
}

export default FileUploader