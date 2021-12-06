import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import { saveAs } from 'file-saver';

const { Dragger } = Upload;
const BASE_URL = process.env.REACT_APP_SERVER_API
const instanceReq = axios.create({
  baseURL: BASE_URL
})

const UploadForm = () => {
  const textFormData = new FormData()
  const resultRequest = async (options) => {
    textFormData.set('text', options.file)
    const newText = await instanceReq.post('api/upload', textFormData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    const file = new File([newText.data], "new.txt", { type: "text/plain;charset=utf-8" });
    saveAs(file);
    options.onSuccess("Ok");
  }

  const props = {
    beforeUpload: file => {
      if (file.type !== 'text/plain') {
        message.error(`${file.name} is not a text file`);
      }
      return file.type === 'text/plain' ? true : Upload.LIST_IGNORE;
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  };

  return (
    <>
      <h1>Spell check</h1>
      <p>Upload your text file to check</p>
      <Dragger
        customRequest={resultRequest}
        {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag text file to this area to upload</p>
      </Dragger>
    </>
  );
};

export const UploadText = () => {
  return <>
    <div className="header"></div>
    <div className="signupWrapper">
      <div className="signupContainer">
        <UploadForm />
      </div>
    </div>
  </>
}
