import { axios } from "../../system";
import React from "react";
import { FileUploader } from "react-drag-drop-files";
import { Icon } from "semantic-ui-react";
import moment from "moment";

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

    const { cashboxId } = data;
    const [files, setFiles] = React.useState(null);
    const uploading = Boolean(files);

    const uploadFile = React.useCallback(async file => {

        var reader = new FileReader();

        let formdata = new FormData();
        formdata.append('file', file);
        formdata.append('name', file.name);
        formdata.append('size', file.size);
        formdata.append('type', file.type);
        formdata.append('date', moment(file.lastModified));
        formdata.append('cashboxId', cashboxId);

        axios.post('expenses/file/upload', formdata)
            .then(({ data }) => {
                console.log(data);
            })
            .catch(console.log)
            .then(console.log);
    }, []);

    React.useEffect(() => {

        const handleUpload = async files => {

            Array.from(files).forEach(async file => {
                await uploadFile(file);
            });

            setFiles(null);
        }

        if (files) {
            handleUpload(files);
        }

    }, [files]);

    return {
        uploading,
        FileUploader: () => <FileUploaderComponent
            files={files}
            setFiles={setFiles}
        />,
    }
}

export default useUpload;