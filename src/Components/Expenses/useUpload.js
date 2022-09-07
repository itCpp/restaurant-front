import { axios } from "../../system";
import React from "react";
import { FileUploader } from "react-drag-drop-files";
import { Icon } from "semantic-ui-react";
import moment from "moment";

const md5 = require('js-md5');
const getFileNameHash = (file, append = "") => md5(file.lastModified + file.name + file.size + file.type + append);

const FileUploaderComponent = props => {

    const { files, setFiles } = props;
    const uploading = Boolean(files);

    return <div className="upload-zone position-relative">

        <FileUploader
            handleChange={setFiles}
            name="file"
            multiple
            hoverTitle="Оставьте файлы тут"
            children={<div className="drag-zone-files">
                <small>{uploading ? "Просходит загрузка файлов..." : "Нажмите или перенесите сюда необходимые файлы"}</small>
                <span>
                    <Icon
                        name="upload"
                        className="me-0 ms-3"
                        color={uploading ? "green" : null}
                    />
                </span>
            </div>}
            disabled={uploading}
        />

        {uploading && <div
            style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                cursor: "no-drop",
            }}
        />}

    </div>
}

const useUpload = data => {

    const { setFilesList, cashboxId } = data;
    const [files, setFiles] = React.useState(null);
    const [uploadProcess, setUploadProcess] = React.useState({});
    const uploading = Boolean(files);

    const uploadFile = React.useCallback(async file => {

        const hash = getFileNameHash(file);
        let formdata = new FormData();

        formdata.append('file', file);
        formdata.append('name', file.name);
        formdata.append('size', file.size);
        formdata.append('type', file.type);
        formdata.append('date', moment(file.lastModified));
        formdata.append('cashboxId', cashboxId);
        formdata.append('hash', hash);

        await axios.post('expenses/file/upload', formdata, {
            onUploadProgress: (progressEvent) => {
                setUploadProcess(p => ({ ...p, [hash]: parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100)) }));
            }
        })
            .then(({ data }) => {
                setFilesList(p => {
                    let rows = [...p];
                    rows.forEach((row, i) => {
                        if (row.id === hash) {
                            rows[i] = data.file;
                        }
                    });
                    return rows;
                });
            })
            .catch(e => {
                setFilesList(p => {
                    let rows = [...p];
                    rows.forEach((row, i) => {
                        if (row.id === hash) {
                            rows[i].id = getFileNameHash(file, new Date);
                            rows[i].error = axios.getError(e) || e?.message;
                        }
                    });
                    return rows;
                });
            })
            .then(() => {
                setUploadProcess(p => ({ ...p, [hash]: 0 }));
            });

    }, [cashboxId]);

    React.useEffect(() => {

        const handleUpload = async files => {

            const files_array = Array.from(files);

            setFilesList(p => {

                let uploads = [];

                files_array.forEach(file => {

                    let hash = getFileNameHash(file);
                    let match = String(file.name).match(/\.([^.]+)$/);
                    let extension = match && match[1];

                    uploads.unshift({
                        id: hash,
                        cashbox_id: cashboxId,
                        created_at: new Date,
                        updated_at: new Date,
                        extension: extension,
                        mime_type: file.type,
                        name: file.name,
                        size: file.size,
                        is_upload: true,
                    });
                });

                return [...uploads, ...p]
            });

            for (let i in files_array)
                await uploadFile(files_array[i]);

            setFiles(null);
        }

        if (files) {
            handleUpload(files);
        }

    }, [files]);

    return {
        uploading,
        uploadProcess,
        FileUploader: () => <FileUploaderComponent
            files={files}
            setFiles={setFiles}
        />,
    }
}

export default useUpload;