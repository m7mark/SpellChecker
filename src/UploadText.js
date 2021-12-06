import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { saveAs } from 'file-saver';

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
    // message.success(`${options.file.name} uploaded successfully`)
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
    <Upload
      customRequest={resultRequest}
      {...props}>
      <Button icon={<UploadOutlined />}>Upload text file only</Button>
      {/* <a href='/somefile.txt' download>Click to download</a> */}
    </Upload>
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
